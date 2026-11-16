// Pack: Space Math 1 — 16 levels for ages 7–8+ (about Grade 2–3).
//
// Each level is plain data:
//   id       stable string — NEVER change it once released (saved stars use it)
//   title    short name shown on the star map
//   icon     emoji on the planet
//   type     problem type id, or an array of ids to mix (see js/problem-types/index.js)
//   params   settings passed to the problem type
//   input    'choices' | 'numpad' | 'compare'  (see js/inputs/index.js)
//   intro    one or two sentences the mascot says before the level
//   example  a worked example shown on the intro screen
//
// You can insert, remove or reorder levels freely — progress is matched by id.

export default {
  id: 'space-math-1',
  title: 'Space Math 1',
  subtitle: 'Ages 7–8+',
  levels: [
    { id: 'warmup-20', title: 'Warm-up', icon: '🚀', type: ['add', 'subtract'], params: { kind: 'within20' }, input: 'choices',
      intro: 'Warm up your engines! Add and take away numbers up to 20. Tap the right answer.', example: '8 + 5 = 13' },
    { id: 'missing-number', title: 'Missing Number', icon: '❓', type: 'missing', input: 'choices',
      intro: 'One number is hiding! Find the missing number that makes the sum true.', example: '7 + ? = 15  →  8' },
    { id: 'tens-ones', title: 'Tens & Ones', icon: '🧱', type: 'place-value', input: 'choices',
      intro: 'Each long rod is ten. Each little cube is one. What number do the blocks make?', example: '4 rods and 7 cubes  →  47' },
    { id: 'compare', title: 'Bigger or Smaller', icon: '🐊', type: 'compare', input: 'compare',
      intro: 'Pick the right sign. Less than, equal to, or greater than. The open mouth faces the bigger number!', example: '482 > 428' },
    { id: 'skip-count', title: 'Number Patterns', icon: '🔢', type: 'skip-count', input: 'choices',
      intro: 'These numbers jump by the same amount each time. Find the missing one!', example: '35, 40, ?, 50  →  45' },
    { id: 'clock', title: 'Space Time', icon: '🕒', type: 'clock', input: 'choices',
      intro: 'Read the clock! The short hand shows the hour. The long hand shows the minutes.', example: 'Long hand on 3  →  quarter past' },
    { id: 'add-2d', title: 'Big Adding', icon: '➕', type: 'add', params: { kind: '2d', regroup: false }, input: 'numpad',
      intro: 'Add two-digit numbers. Add the tens, then add the ones. Type your answer!', example: '34 + 25 = 59' },
    { id: 'add-2d-regroup', title: 'Carry the Ten', icon: '🎒', type: 'add', params: { kind: '2d', regroup: true }, input: 'numpad',
      intro: 'When the ones make 10 or more, carry a ten! Type your answer.', example: '47 + 38 = 85' },
    { id: 'sub-2d', title: 'Big Take Away', icon: '➖', type: 'subtract', params: { kind: '2d', regroup: false }, input: 'numpad',
      intro: 'Take away two-digit numbers. Tens first, then ones.', example: '68 − 25 = 43' },
    { id: 'sub-2d-regroup', title: 'Swap a Ten', icon: '🔄', type: 'subtract', params: { kind: '2d', regroup: true }, input: 'numpad',
      intro: "Not enough ones? Swap one ten for ten ones, then take away.", example: '52 − 27 = 25' },
    { id: 'tens-hundreds', title: 'Hundreds Hop', icon: '💯', type: ['add', 'subtract'], params: { kind: 'tens-hundreds' }, input: 'numpad',
      intro: 'Add and take away tens and hundreds with big numbers up to 1000.', example: '380 + 50 = 430' },
    { id: 'equal-groups', title: 'Equal Groups', icon: '🛸', type: 'groups', input: 'choices',
      intro: 'Groups with the same number in each. How many altogether? This is the start of times tables!', example: '3 groups of 4 = 12' },
    { id: 'times-2-5-10', title: 'Times 2, 5, 10', icon: '✖️', type: 'times', params: { tables: [2, 5, 10] }, input: 'numpad',
      intro: 'Times tables for 2, 5 and 10. Count in jumps to help you.', example: '7 × 5 = 35' },
    { id: 'times-3-4', title: 'Times 3 & 4', icon: '🌟', type: 'times', params: { tables: [3, 4] }, input: 'numpad',
      intro: 'Now the 3 and 4 times tables. You can do it!', example: '6 × 4 = 24' },
    { id: 'sharing', title: 'Fair Shares', icon: '🍰', type: 'share', input: 'numpad',
      intro: 'Share the stars equally between the rockets. How many does each rocket get?', example: '12 shared by 3  →  4 each' },
    { id: 'story', title: 'Space Stories', icon: '📖', type: 'story', input: 'numpad',
      intro: 'Listen to the space story. It has two steps! Work it out and type the answer.', example: '25 − 8 = 17, then 17 + 12 = 29' },
  ],
};
