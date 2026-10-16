import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // sans I, L, O, 0, 1 (ambigus)

async function generateCertificateCode() {
  for (let attempt = 0; attempt < 20; attempt++) {
    let suffix = "";
    for (let i = 0; i < 6; i++) {
      suffix += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
    }
    const code = `RODLAB-WEB-${suffix}`;
    const exists = await db.certificate.findUnique({ where: { code } });
    if (!exists) return code;
  }
  // Fallback quasi impossible : timestamp
  return `RODLAB-WEB-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

/** Soumet les réponses de l'examen final d'un cours, note, et émet le certificat si réussi. */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const answers = body?.answers;
  if (!answers || typeof answers !== "object" || Array.isArray(answers))
    return NextResponse.json({ error: "Réponses manquantes" }, { status: 400 });

  const courseId = typeof body?.courseId === "string" ? body.courseId : null;
  const course = courseId
    ? await db.course.findFirst({ where: { id: courseId, published: true } })
    : await db.course.findFirst({ where: { published: true }, orderBy: { createdAt: "asc" } });
  if (!course) return NextResponse.json({ error: "Formation introuvable" }, { status: 404 });

  const quiz = await db.quiz.findUnique({
    where: { courseId: course.id },
    include: { questions: { orderBy: { order: "asc" } } },
  });
  if (!quiz || quiz.questions.length === 0)
    return NextResponse.json({ error: "Examen indisponible" }, { status: 404 });

  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
  });
  if (!enrollment)
    return NextResponse.json({ error: "Inscrivez-vous d'abord à la formation" }, { status: 403 });

  // L'examen se débloque uniquement lorsque tous les modules sont terminés
  const totalLessons = await db.lesson.count({ where: { module: { courseId: course.id } } });
  const completedLessons = await db.lessonProgress.count({
    where: { userId: session.user.id, lesson: { module: { courseId: course.id } } },
  });
  if (completedLessons < totalLessons)
    return NextResponse.json(
      {
        error: `Terminez d'abord tous les modules (${completedLessons}/${totalLessons} leçons) pour débloquer l'examen.`,
      },
      { status: 403 }
    );

  // Correction
  let correct = 0;
  const details = quiz.questions.map((q) => {
    const chosen = typeof answers[q.id] === "number" ? answers[q.id] : -1;
    const isCorrect = chosen === q.answer;
    if (isCorrect) correct++;
    return {
      questionId: q.id,
      prompt: q.prompt,
      chosen,
      answer: q.answer,
      isCorrect,
      explanation: q.explanation,
    };
  });
  const total = quiz.questions.length;
  const score = Math.round((correct / total) * 100);
  const passed = score >= quiz.passScore;

  const attempt = await db.quizAttempt.create({
    data: {
      userId: session.user.id,
      quizId: quiz.id,
      enrollmentId: enrollment.id,
      answers: JSON.stringify(answers),
      score,
      correct,
      total,
      passed,
    },
  });

  // Émission du certificat (une seule fois par inscription)
  let certificateCode: string | null = null;
  const existingCertificate = await db.certificate.findUnique({
    where: { enrollmentId: enrollment.id },
  });
  if (passed && existingCertificate) {
    certificateCode = existingCertificate.code;
  } else if (passed) {
    const code = await generateCertificateCode();
    const certificate = await db.certificate.create({
      data: {
        code,
        userId: session.user.id,
        courseId: course.id,
        enrollmentId: enrollment.id,
        score,
        holderName: session.user.name ?? "Apprenant RodLab",
      },
    });
    certificateCode = certificate.code;
    await db.enrollment.update({
      where: { id: enrollment.id },
      data: { status: "COMPLETED", completedAt: new Date() },
    });
    await db.notification.create({
      data: {
        userId: session.user.id,
        title: "🎉 Certificat RodLab obtenu !",
        body: `Félicitations ! Vous avez réussi l'examen final avec ${score} %. Votre certificat ${code} est prêt à être téléchargé.`,
        url: `/dashboard/formation/${course.slug}/certificat`,
      },
    });
  }

  return NextResponse.json({
    attemptId: attempt.id,
    score,
    correct,
    total,
    passed,
    passScore: quiz.passScore,
    certificateCode,
    details,
  });
}
