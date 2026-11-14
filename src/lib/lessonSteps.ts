import { Level } from "@/types/level";
import { LessonStepData } from "@/types/lesson";
import { starterFor } from "@/lib/starterFor";
import { STEP_HINTS, getHintForStep } from "@/lib/hints";

/**
 * Hand-authored 5-step micro-lessons for the levels a new learner actually
 * plays through first. Every other level falls back to a single MINI_IDE
 * step built from its existing task/assertion (see getStepsForLevel below),
 * so all 44 levels stay playable — only these have the richer flow.
 */
const CUSTOM_STEPS: Record<string, LessonStepData[]> = {
  "PY-01": [
    {
      kind: "theory",
      title: "Printing Text",
      explanation:
        "print() displays text in the console. Wrap literal text in quotes so Python treats it as a string, not code.",
      example: `print("Hello, World!")`,
      hint: STEP_HINTS["PY-01"][0],
    },
    {
      kind: "fill_blank",
      prompt: "Fill in the blank so the program prints the exact greeting.",
      template: `print({{}})`,
      blanks: [`"Hello, World!"`],
      options: [`"Hi there"`, `"Hello, World!"`, `'Hello'`],
      hint: STEP_HINTS["PY-01"][1],
    },
    {
      kind: "predict",
      prompt: "What will this print?",
      code: `print("Hello, World!")`,
      choices: ["Hello, World!", "Hello World", "HELLO, WORLD!", `print(Hello, World!)`],
      correctIndex: 0,
      hint: STEP_HINTS["PY-01"][2],
    },
    {
      kind: "spot_bug",
      prompt: "This code crashes with a syntax error. Click the buggy line.",
      buggyCode: `name = "World"\nprint(Hello, name)`,
      bugLine: 2,
      fixedLine: `print("Hello,", name)`,
      hint: STEP_HINTS["PY-01"][3],
    },
    {
      kind: "mini_ide",
      prompt: "Now write it yourself: print the exact text 'Hello, World!'.",
      starterCode: `# write your Python here`,
      assertion: "stdout == 'Hello, World!\\n'",
      hint: STEP_HINTS["PY-01"][4],
    },
  ],

  "PY-02": [
    {
      kind: "theory",
      title: "Variables",
      explanation:
        "A variable stores a value under a name using =. Numbers are written plainly; text (strings) needs quotes.",
      example: `xp = 100\nplayer = 'Nova'`,
      hint: STEP_HINTS["PY-02"][0],
    },
    {
      kind: "fill_blank",
      prompt: "Assign 100 to xp and 'Nova' to player.",
      template: `xp = {{}}\nplayer = {{}}`,
      blanks: ["100", "'Nova'"],
      options: ["'Kai'", "100", "50", "'Nova'"],
      hint: STEP_HINTS["PY-02"][1],
    },
    {
      kind: "predict",
      prompt: "What does this print?",
      code: `xp = 20\nxp = xp + 5\nprint(xp)`,
      choices: ["25", "20", "5", "Error"],
      correctIndex: 0,
      hint: STEP_HINTS["PY-02"][2],
    },
    {
      kind: "spot_bug",
      prompt: "This code crashes. Click the buggy line.",
      buggyCode: `coins = 10\ncoins = coins + 1o`,
      bugLine: 2,
      fixedLine: `coins = coins + 10`,
      hint: STEP_HINTS["PY-02"][3],
    },
    {
      kind: "mini_ide",
      prompt: "Assign 100 to xp and 'Nova' to player.",
      starterCode: `# assign xp and player below`,
      assertion: "xp == 100 and player == 'Nova'",
      hint: STEP_HINTS["PY-02"][4],
    },
  ],

  "PY-03": [
    {
      kind: "theory",
      title: "f-strings",
      explanation:
        "Prefix a string with f and put a variable inside {} to interpolate its value directly into the text.",
      example: `name = 'Kai'\nprint(f'Player: {name}')`,
      hint: STEP_HINTS["PY-03"][0],
    },
    {
      kind: "fill_blank",
      prompt: "Turn this into an f-string so {name} is replaced by its value.",
      template: `name = 'Kai'\nprint({{}}'Player: {name}')`,
      blanks: ["f"],
      options: ["r", "f", "b"],
      hint: STEP_HINTS["PY-03"][1],
    },
    {
      kind: "predict",
      prompt: "What does this print?",
      code: `age = 7\nprint(f'Age: {age}')`,
      choices: ["Age: 7", "Age: age", "Age: {age}", "Error"],
      correctIndex: 0,
      hint: STEP_HINTS["PY-03"][2],
    },
    {
      kind: "spot_bug",
      prompt: "This prints the literal text instead of Kai's name. Click the buggy line.",
      buggyCode: `name = 'Kai'\nprint('Player: {name}')`,
      bugLine: 2,
      fixedLine: `print(f'Player: {name}')`,
      hint: STEP_HINTS["PY-03"][3],
    },
    {
      kind: "mini_ide",
      prompt: "Fix the code so it prints 'Player: Kai' using an f-string.",
      starterCode: `name = 'Kai'\nprint('Player: {name}')`,
      assertion: "stdout == 'Player: Kai\\n'",
      hint: STEP_HINTS["PY-03"][4],
    },
  ],

  "PY-04": [
    {
      kind: "theory",
      title: "Type Casting",
      explanation:
        "input() and many other sources hand you strings. Use int(), float(), or str() to convert between types.",
      example: `raw = '450'\ntotal = int(raw) + 50`,
      hint: STEP_HINTS["PY-04"][0],
    },
    {
      kind: "fill_blank",
      prompt: "Convert raw_xp to an integer before adding 50.",
      template: `raw_xp = '450'\ntotal = {{}}(raw_xp) + 50`,
      blanks: ["int"],
      options: ["str", "int", "float"],
      hint: STEP_HINTS["PY-04"][1],
    },
    {
      kind: "predict",
      prompt: "What does this print?",
      code: `x = int('7') + int('3')\nprint(x)`,
      choices: ["10", "'73'", "73", "Error"],
      correctIndex: 0,
      hint: STEP_HINTS["PY-04"][2],
    },
    {
      kind: "spot_bug",
      prompt: "This crashes with a TypeError. Click the buggy line.",
      buggyCode: `raw_xp = '450'\ntotal = raw_xp + 50`,
      bugLine: 2,
      fixedLine: `total = int(raw_xp) + 50`,
      hint: STEP_HINTS["PY-04"][3],
    },
    {
      kind: "mini_ide",
      prompt: "Convert raw_xp to an int and add 50, storing the result in total.",
      starterCode: `raw_xp = '450'\n`,
      assertion: "total == 500 and isinstance(total, int)",
      hint: STEP_HINTS["PY-04"][4],
    },
  ],

  "PY-05": [
    {
      kind: "theory",
      title: "Reading Input",
      explanation:
        "input() pauses the program and returns whatever the user typed, always as a string — convert it before doing math.",
      example: `age = int(input())\nprint(age + 1)`,
      hint: STEP_HINTS["PY-05"][0],
    },
    {
      kind: "fill_blank",
      prompt: "Read a number from input and convert it before adding 1.",
      template: `age = {{}}(input())\nprint(age + 1)`,
      blanks: ["int"],
      options: ["str", "list", "int"],
      hint: STEP_HINTS["PY-05"][1],
    },
    {
      kind: "predict",
      prompt: "If the mocked input is 4, what prints?",
      code: `n = int(input())\nprint(n * 2)`,
      choices: ["8", "44", "4", "Error"],
      correctIndex: 0,
      hint: STEP_HINTS["PY-05"][2],
    },
    {
      kind: "spot_bug",
      prompt: "This crashes because age is never converted from text. Click the buggy line.",
      buggyCode: `age = input()\nprint(age + 1)`,
      bugLine: 2,
      fixedLine: `print(int(age) + 1)`,
      hint: STEP_HINTS["PY-05"][3],
    },
    {
      kind: "mini_ide",
      prompt: "Read an integer from input and print it plus 1. (Input is mocked as 19.)",
      starterCode: `age = \nprint()`,
      assertion: "stdout == '20\\n'",
      stdin: "19",
      hint: STEP_HINTS["PY-05"][4],
    },
  ],
};

export function getStepsForLevel(level: Level): LessonStepData[] {
  const custom = CUSTOM_STEPS[level.id];
  if (custom) return custom;

  return [
    {
      kind: "mini_ide",
      prompt: level.task,
      starterCode: starterFor(level.task),
      assertion: level.assertion,
      hint: getHintForStep(level, undefined, 0),
    },
  ];
}
