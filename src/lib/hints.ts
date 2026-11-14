import { Level } from "@/types/level";
import { LessonStepData } from "@/types/lesson";

/**
 * Step-specific, beginner-friendly hints for hand-crafted micro-lessons (PY-01 to PY-05).
 * Each step index (0 = Theory, 1 = Fill-in-Blank, 2 = Predict, 3 = Spot Bug, 4 = Mini IDE)
 * provides exact, encouraging, actionable guidance.
 */
export const STEP_HINTS: Record<string, Record<number, string>> = {
  "PY-01": {
    0: "💡 Key rule: Any text inside print() must be enclosed in quotes (like \"Hello\") so Python knows it is words to display, not variable names!",
    1: "💡 Tip: Choose the token with double quotes: \"Hello, World!\". Without quotes, Python thinks 'Hello' is a variable and crashes.",
    2: "💡 Tip: Python prints only the characters inside the quotes. The outer quotation marks themselves are never displayed on the screen.",
    3: "💡 Tip: Check line 2 carefully. Notice that 'name' is a variable, but 'Hello' was written without quotation marks! Click line 2.",
    4: "💡 Tip: Write print(\"Hello, World!\") exactly. Make sure to include the double quotes, the comma, the space, and the exclamation point!",
  },
  "PY-02": {
    0: "💡 Key rule: Variables are created with 'name = value'. Numbers are written plainly (100), while text strings need quotes ('Nova').",
    1: "💡 Tip: Place 100 in the first slot for xp (numbers don't use quotes), and 'Nova' in the second slot for player (text strings need quotes).",
    2: "💡 Tip: xp starts at 20. Then xp = xp + 5 adds 5 to 20, making it 25. So print(xp) outputs 25.",
    3: "💡 Tip: Look closely at line 2: '1o' uses the letter 'o' instead of the number 0! In Python, numbers must use real digits. Click line 2.",
    4: "💡 Tip: Type two lines in the editor: \nxp = 100\nplayer = 'Nova'",
  },
  "PY-03": {
    0: "💡 Key rule: An f-string starts with the letter 'f' right before the opening quote: f'Hello {name}'. Python will replace {name} with the variable's value!",
    1: "💡 Tip: Choose 'f' to prefix the string. This turns on Python's string interpolation so {name} gets replaced with 'Kai'.",
    2: "💡 Tip: Because age = 7, Python replaces {age} with the number 7, printing: Age: 7.",
    3: "💡 Tip: Look at line 2. It has no 'f' before the quote! Without 'f', Python prints '{name}' literally as text instead of 'Kai'. Click line 2.",
    4: "💡 Tip: Add the letter f immediately before the opening quote on line 2: print(f'Player: {name}')",
  },
  "PY-04": {
    0: "💡 Key rule: '450' in quotes is text (a string); 450 without quotes is a number (integer). Use int('450') to convert text into a real number you can do math with.",
    1: "💡 Tip: Choose 'int' to wrap raw_xp: total = int(raw_xp) + 50. This converts '450' into the number 450 before adding 50.",
    2: "💡 Tip: int('7') becomes 7, and int('3') becomes 3. 7 + 3 equals 10.",
    3: "💡 Tip: Line 2 tries to add a string ('450') and an integer (50) directly: '450' + 50 causes a TypeError! Click line 2.",
    4: "💡 Tip: Write total = int(raw_xp) + 50 to convert raw_xp into an int and add 50.",
  },
  "PY-05": {
    0: "💡 Key rule: input() always reads user input as text. If you want to do math with it, you must wrap it: int(input()).",
    1: "💡 Tip: Select 'int' to convert input() into a number before adding 1.",
    2: "💡 Tip: The mocked input is 4. int(input()) turns it into 4, and 4 * 2 prints 8.",
    3: "💡 Tip: Line 2 tries to do age + 1, but age is still a string of text from input()! It needs int(age). Click line 2.",
    4: "💡 Tip: First line: age = int(input()). Second line: print(age + 1). (The input 19 is automatically fed in).",
  },
};

/**
 * Curated beginner-friendly hints for all 44 levels in the curriculum.
 */
export const LEVEL_HINTS: Record<string, string> = {
  "PY-01": "💡 Tip: Use print(\"Hello, World!\") with double quotes, matching the exact comma, space, and exclamation point.",
  "PY-02": "💡 Tip: Assign values on separate lines: xp = 100 (number, no quotes) and player = 'Nova' (string, with quotes).",
  "PY-03": "💡 Tip: Put an 'f' before the opening quote: print(f'Player: {name}') so Python evaluates {name}.",
  "PY-04": "💡 Tip: Convert raw_xp using int(): total = int(raw_xp) + 50.",
  "PY-05": "💡 Tip: Read and convert input on the first line: age = int(input()), then print(age + 1).",
  "PY-06": "💡 Tip: In Python, comparisons like 10 > 5 evaluate to True. Write: is_ready = 10 > 5",
  "PY-07": "💡 Tip: Remember that Python blocks must be indented with 4 spaces after the colon: if score >= 100:\n    # 4 spaces",
  "PY-08": "💡 Tip: Combine conditions with logical operators: if key_card and not alarm: — check that both conditions match the goal.",
  "PY-09": "💡 Tip: range(start, stop, step) produces sequences. To get odd numbers 1, 3, 5, 7, 9, use: for i in range(1, 10, 2): print(i)",
  "PY-10": "💡 Tip: Inside the while loop, decrement hp by 20 on each pass (hp -= 20) so the loop eventually reaches 0 and terminates.",
  "PY-11": "💡 Tip: Use 'continue' to skip the rest of the current iteration when n is even: if n % 2 == 0: continue",
  "PY-12": "💡 Tip: Use a loop that runs up to 3 times. Read each guess with guess = int(input()), check if guess == secret, and print match or continue.",
  "PY-13": "💡 Tip: Define your function using 'def calculate_tax(price, rate=0.05):' and calculate price * rate inside.",
  "PY-14": "💡 Tip: Use 'return result' instead of 'print(result)' so the function produces a usable value that callers can store.",
  "PY-15": "💡 Tip: Slicing syntax is list[start:stop]. To get the first 3 items: ranks[0:3]. To remove and return the last item: ranks.pop()",
  "PY-16": "💡 Tip: Use the safe dictionary .get() method: user.get('theme', 'dark') to return 'dark' if 'theme' does not exist without crashing.",
  "PY-17": "💡 Tip: Iterate over key-value pairs simultaneously with .items(): for key, val in stats.items(): print(f'{key}: {val}')",
  "PY-18": "💡 Tip: Passing any list into set() eliminates all duplicate values: unique_ips = set(raw_ips)",
  "PY-19": "💡 Tip: A list comprehension has the form [expression for item in iterable if condition]. For example: [x**2 for x in nums if x > 0]",
  "PY-20": "💡 Tip: A dict comprehension can swap keys and values: {v: k for k, v in original_dict.items()}",
  "PY-21": "💡 Tip: Chain string methods: raw.strip() removes whitespace, .split(',') turns CSV into a list, and ', '.join(...) links them together.",
  "PY-22": "💡 Tip: Wrap the risky conversion in a try block: try:\n    val = int(user_str)\nexcept ValueError:\n    val = 0",
  "PY-23": "💡 Tip: Iterate through the inventory dictionary and collect items where stock < min_threshold into a filtered result dictionary.",
  "PY-24": "💡 Tip: In class Server, define def __init__(self, host, port): and store self.host = host, self.port = port, self.status = 'STOPPED'",
  "PY-25": "💡 Tip: Methods must take 'self' as their first parameter: def start(self): self.status = 'RUNNING'",
  "PY-26": "💡 Tip: Implement __str__(self) and return a formatted string like f'{self.host}:{self.port} [{self.status}]'.",
  "PY-27": "💡 Tip: Implement __len__(self) returning len(self.items) and __getitem__(self, idx) returning self.items[idx].",
  "PY-28": "💡 Tip: Inherit by passing the base class: class SecureServer(Server): then call super().__init__(...) in its constructor.",
  "PY-29": "💡 Tip: Use @property above a getter method, and @<field>.setter above the setter method to validate values.",
  "PY-30": "💡 Tip: Define a decorator function that accepts func, defines wrapper(*args, **kwargs) around it, and returns wrapper.",
  "PY-31": "💡 Tip: Use the 'yield' keyword instead of 'return' to create a generator that streams values one by one.",
  "PY-32": "💡 Tip: Context managers define __enter__(self) which sets up resources and __exit__(self, exc_type, exc_val, exc_tb) which cleans them up.",
  "PY-33": "💡 Tip: Write a test class inheriting from unittest.TestCase, with test methods starting with 'def test_...' and using self.assertEqual.",
  "PY-34": "💡 Tip: Read files safely with: with open('filename.txt', 'r') as f: content = f.read()",
  "PY-35": "💡 Tip: Parse JSON strings into Python dicts with json.loads(text), and convert dicts to JSON strings with json.dumps(data).",
  "PY-36": "💡 Tip: Use the 're' module: re.findall(r'pattern', text) or re.search() to find matching expressions.",
  "PY-37": "💡 Tip: Define async functions with 'async def' and pause on coroutines with 'await asyncio.sleep(seconds)'.",
  "PY-38": "💡 Tip: Run multiple coroutines concurrently with: results = await asyncio.gather(task1(), task2())",
  "PY-39": "💡 Tip: Use logging.basicConfig(level=logging.INFO) and logging.info('message') instead of print() for structured messages.",
  "PY-40": "💡 Tip: Use argparse.ArgumentParser() to add arguments with parser.add_argument('--flag') and parse with parser.parse_args().",
  "PY-41": "💡 Tip: Create lightweight data containers with @dataclass from the dataclasses module.",
  "PY-42": "💡 Tip: Use Python typing module annotations: def process(data: list[int]) -> dict[str, int]:",
  "PY-43": "💡 Tip: Use collections.Counter(items) to quickly count frequency of elements in a list.",
  "PY-44": "💡 Tip: The final challenge combines clean architecture: define functions with typing, docstrings, error handling, and structured output!",
};

/**
 * Returns a precise, beginner-friendly hint for the current active question/step.
 */
export function getHintForStep(level: Level, step?: LessonStepData, stepIndex: number = 0): string {
  // 1. If step has an explicit custom hint attached, use it
  if (step?.hint) {
    return step.hint;
  }

  // 2. Check for micro-lesson step-specific hint (PY-01 through PY-05)
  const customStepHints = STEP_HINTS[level.id];
  if (customStepHints && customStepHints[stepIndex]) {
    return customStepHints[stepIndex];
  }

  // 3. Check for level-specific curated hint (PY-01 through PY-44)
  if (LEVEL_HINTS[level.id]) {
    return LEVEL_HINTS[level.id];
  }

  // 4. Intelligent fallback based on task and concept
  return `💡 Tip: For this challenge, focus on ${level.concept}. Your goal is: ${level.task}. Check your syntax and variable names carefully!`;
}
