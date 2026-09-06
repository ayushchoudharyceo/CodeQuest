export interface TheoryStepData {
  kind: "theory";
  title: string;
  explanation: string;
  example: string;
}

export interface FillBlankStepData {
  kind: "fill_blank";
  prompt: string;
  /** Code with blanks marked as `{{}}`, filled in order by `blanks`. */
  template: string;
  /** Correct token for each `{{}}` slot, in order. */
  blanks: string[];
  /** Token bank shown to the student — includes the correct answers plus distractors. */
  options: string[];
}

export interface PredictStepData {
  kind: "predict";
  prompt: string;
  code: string;
  choices: string[];
  correctIndex: number;
}

export interface SpotBugStepData {
  kind: "spot_bug";
  prompt: string;
  buggyCode: string;
  /** 1-indexed line number containing the bug. */
  bugLine: number;
  fixedLine: string;
}

export interface MiniIdeStepData {
  kind: "mini_ide";
  prompt: string;
  starterCode: string;
  /** Same grammar as Level.assertion: `stdout == '...'` or a boolean Python expression. */
  assertion: string;
  /** Optional mocked input() value, for levels that read from stdin. */
  stdin?: string;
}

export type LessonStepData =
  | TheoryStepData
  | FillBlankStepData
  | PredictStepData
  | SpotBugStepData
  | MiniIdeStepData;
