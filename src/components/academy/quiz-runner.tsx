"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, ArrowRight, CheckCircle2, XCircle, Award, Loader2, RotateCcw, Lightbulb,
} from "lucide-react";

export type QuizQuestionClient = {
  id: string;
  order: number;
  prompt: string;
  options: string[];
};

type QuizResult = {
  score: number;
  correct: number;
  total: number;
  passed: boolean;
  passScore: number;
  certificateCode: string | null;
  details: {
    questionId: string;
    prompt: string;
    chosen: number;
    answer: number;
    isCorrect: boolean;
    explanation: string | null;
  }[];
};

const LETTERS = ["A", "B", "C", "D"];

/**
 * Examen final : une question à la fois, navigation libre, correction serveur,
 * écran de résultats détaillé avec explications.
 * `courseId` scope l'examen sur un cours du catalogue ; `courseSlug` cible la page certificat.
 */
export function QuizRunner({
  questions,
  courseId,
  courseSlug,
}: {
  questions: QuizQuestionClient[];
  courseId?: string;
  courseSlug?: string;
}) {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const question = questions[index];
  const isLast = index === questions.length - 1;
  const allAnswered = answeredCount === questions.length;

  const select = (optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }));
  };

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/formation/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, ...(courseId ? { courseId } : {}) }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Correction impossible pour le moment");
      setResult(data as QuizResult);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inattendue");
    } finally {
      setSubmitting(false);
    }
  };

  const retry = () => {
    setResult(null);
    setAnswers({});
    setIndex(0);
    setStarted(true);
  };

  // ————— Écran de résultats —————
  if (result) {
    return (
      <div className="grid gap-6">
        <div
          className={`overflow-hidden rounded-3xl border p-8 text-center sm:p-10 ${
            result.passed ? "border-forest-300 bg-forest-50" : "border-terra-300 bg-terra-50/60"
          }`}
        >
          <div
            className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full font-display text-3xl font-semibold ${
              result.passed ? "bg-forest-700 text-cream-50" : "bg-terra-600 text-cream-50"
            }`}
          >
            {result.score} %
          </div>
          <h2 className="mt-5 font-display text-2xl font-semibold text-ink-900">
            {result.passed ? "Félicitations, examen réussi !" : "Presque — retentez votre chance !"}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-500">
            {result.correct}/{result.total} bonnes réponses. Seuil de réussite : {result.passScore} %.
            {result.passed
              ? " Votre certificat est prêt : téléchargez-le et partagez-le !"
              : " Relisez les modules pointés ci-dessous, puis repassez l'examen quand vous voulez."}
          </p>

          {result.passed && result.certificateCode && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={courseSlug ? `/dashboard/formation/${courseSlug}/certificat` : "/dashboard/formation/certificat"}
                className="inline-flex items-center gap-2 rounded-full bg-forest-700 px-6 py-3.5 text-sm font-semibold text-cream-50 shadow-chip transition hover:bg-forest-600"
              >
                <Award className="h-4 w-4" aria-hidden="true" /> Voir mon certificat
              </Link>
              <a
                href={`/api/formation/certificat/${result.certificateCode}`}
                className="inline-flex items-center gap-2 rounded-full bg-terra-600 px-6 py-3.5 text-sm font-semibold text-cream-50 transition hover:bg-terra-500"
              >
                Télécharger le PDF
              </a>
            </div>
          )}
          {!result.passed && (
            <button
              onClick={retry}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest-700 px-6 py-3.5 text-sm font-semibold text-cream-50 transition hover:bg-forest-600"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Repasser l&apos;examen
            </button>
          )}
        </div>

        {/* Détail des réponses */}
        <div className="rounded-3xl border border-cream-300 bg-white">
          <h3 className="border-b border-cream-300 px-6 py-4 text-sm font-semibold text-ink-900">
            Correction détaillée
          </h3>
          <ol className="grid gap-0 divide-y divide-cream-200">
            {result.details.map((d, i) => (
              <li key={d.questionId} className="px-6 py-4">
                <div className="flex items-start gap-3">
                  {d.isCorrect ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-forest-600" aria-hidden="true" />
                  ) : (
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" aria-hidden="true" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink-900">
                      {i + 1}. {d.prompt}
                    </p>
                    <p className="mt-1.5 text-xs text-ink-500">
                      Votre réponse :{" "}
                      <span className={d.isCorrect ? "font-semibold text-forest-700" : "font-semibold text-red-600"}>
                        {d.chosen >= 0 ? `${LETTERS[d.chosen] ?? "?"} — ${d.chosen < (questions[i]?.options.length ?? 0) ? questions[i].options[d.chosen] : "réponse manquante"}` : "Pas de réponse"}
                      </span>
                      {!d.isCorrect && (
                        <>
                          {" "}· Bonne réponse :{" "}
                          <span className="font-semibold text-forest-700">
                            {LETTERS[d.answer]} — {questions[i]?.options[d.answer] ?? ""}
                          </span>
                        </>
                      )}
                    </p>
                    {d.explanation && (
                      <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-cream-100 px-3 py-2 text-xs leading-relaxed text-ink-700">
                        <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-400" aria-hidden="true" />
                        {d.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }

  // ————— Écran d'accueil de l'examen —————
  if (!started) {
    return (
      <div className="rounded-3xl border border-gold-400/60 bg-gold-100/30 p-8 text-center sm:p-10">
        <h2 className="font-display text-2xl font-semibold text-ink-900">Examen final</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-500">
          {questions.length} questions à choix multiple couvrant les 8 modules. Score requis pour obtenir votre
          certificat : 70 %. Prenez le temps de lire chaque question — vous pouvez revenir en arrière avant de
          soumettre.
        </p>
        <div className="mx-auto mt-6 grid max-w-md grid-cols-3 gap-3 text-center">
          {[
            { v: `${questions.length}`, l: "questions" },
            { v: "70 %", l: "pour réussir" },
            { v: "∞", l: "tentatives" },
          ].map((s) => (
            <div key={s.l} className="rounded-xl border border-cream-300 bg-white px-3 py-3.5">
              <p className="font-display text-lg font-semibold text-forest-700">{s.v}</p>
              <p className="text-[11px] text-ink-400">{s.l}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => setStarted(true)}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-terra-600 px-8 py-4 text-sm font-semibold text-cream-50 shadow-chip transition hover:bg-terra-500"
        >
          Démarrer l&apos;examen <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    );
  }

  // ————— Question courante —————
  return (
    <div className="grid gap-5">
      {/* Progression */}
      <div>
        <div className="flex items-center justify-between text-xs font-medium text-ink-500">
          <span>
            Question <span className="font-semibold text-ink-900">{index + 1}</span> / {questions.length}
          </span>
          <span>{answeredCount} répondue(s)</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-cream-200">
          <div
            className="h-full rounded-full bg-forest-600 transition-all"
            style={{ width: `${((index + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="rounded-3xl border border-cream-300 bg-white p-6 sm:p-8">
        <p className="font-display text-lg font-semibold leading-snug text-ink-900">{question.prompt}</p>
        <div className="mt-5 grid gap-2.5" role="radiogroup" aria-label={`Réponses à la question ${index + 1}`}>
          {question.options.map((option, oi) => {
            const selected = answers[question.id] === oi;
            return (
              <button
                key={oi}
                onClick={() => select(oi)}
                role="radio"
                aria-checked={selected}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition ${
                  selected
                    ? "border-forest-600 bg-forest-50 text-ink-900"
                    : "border-cream-300 bg-cream-50 text-ink-700 hover:border-forest-300 hover:bg-white"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                    selected ? "bg-forest-700 text-cream-50" : "bg-cream-200 text-ink-500"
                  }`}
                >
                  {LETTERS[oi]}
                </span>
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-xs text-red-700">{error}</p>
      )}

      {/* Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="inline-flex items-center gap-2 rounded-full border border-cream-300 bg-white px-5 py-3 text-xs font-semibold text-ink-700 transition hover:bg-cream-100 disabled:opacity-40"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Précédent
        </button>

        {!isLast ? (
          <button
            onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
            className="inline-flex items-center gap-2 rounded-full bg-forest-700 px-6 py-3 text-xs font-semibold text-cream-50 transition hover:bg-forest-600"
          >
            Suivant <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={submitting || !allAnswered}
            className="inline-flex items-center gap-2 rounded-full bg-terra-600 px-6 py-3 text-xs font-semibold text-cream-50 shadow-chip transition hover:bg-terra-500 disabled:opacity-50"
            title={allAnswered ? "Soumettre mes réponses" : "Répondez d'abord à toutes les questions"}
          >
            {submitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> Correction en cours…
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Soumettre mes réponses
              </>
            )}
          </button>
        )}
      </div>

      {/* Saut rapide */}
      <div className="flex flex-wrap gap-1.5">
        {questions.map((q, qi) => {
          const answered = answers[q.id] !== undefined;
          return (
            <button
              key={q.id}
              onClick={() => setIndex(qi)}
              aria-label={`Aller à la question ${qi + 1}`}
              aria-current={qi === index ? "true" : undefined}
              className={`h-7 w-7 rounded-lg text-[11px] font-semibold transition ${
                qi === index
                  ? "bg-terra-600 text-cream-50"
                  : answered
                    ? "bg-forest-100 text-forest-700 hover:bg-forest-200"
                    : "bg-cream-200 text-ink-400 hover:bg-cream-300"
              }`}
            >
              {qi + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
