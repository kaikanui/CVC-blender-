/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WordItem, GameLevel } from './types.ts';

export const CVC_WORDS: WordItem[] = [
  { id: 'cvc1', word: 'cat', clue: ['c', 'a', 't'], category: 'cvc', emoji: '🐱', distractors: ['can', 'cap', 'cot', 'bat'] },
  { id: 'cvc2', word: 'dog', clue: ['d', 'o', 'g'], category: 'cvc', emoji: '🐶', distractors: ['dig', 'log', 'dot', 'pig'] },
  { id: 'cvc3', word: 'pig', clue: ['p', 'i', 'g'], category: 'cvc', emoji: '🐷', distractors: ['pin', 'peg', 'wig', 'dog'] },
  { id: 'cvc4', word: 'sun', clue: ['s', 'u', 'n'], category: 'cvc', emoji: '☀️', distractors: ['run', 'sad', 'sub', 'bus'] },
  { id: 'cvc5', word: 'bug', clue: ['b', 'u', 'g'], category: 'cvc', emoji: '🐛', distractors: ['bag', 'rug', 'bus', 'hug'] },
  { id: 'cvc6', word: 'map', clue: ['m', 'a', 'p'], category: 'cvc', emoji: '🗺️', distractors: ['mop', 'man', 'cap', 'nap'] },
  { id: 'cvc7', word: 'pin', clue: ['p', 'i', 'n'], category: 'cvc', emoji: '📌', distractors: ['pen', 'pig', 'pan', 'bin'] },
  { id: 'cvc8', word: 'net', clue: ['n', 'e', 't'], category: 'cvc', emoji: '🥅', distractors: ['wet', 'nut', 'not', 'pet'] },
  { id: 'cvc9', word: 'cup', clue: ['c', 'u', 'p'], category: 'cvc', emoji: '🥤', distractors: ['cap', 'cub', 'cut', 'tub'] },
  { id: 'cvc10', word: 'fox', clue: ['f', 'o', 'x'], category: 'cvc', emoji: '🦊', distractors: ['box', 'fix', 'fed', 'fun'] },
  { id: 'cvc11', word: 'hen', clue: ['h', 'e', 'n'], category: 'cvc', emoji: '🐔', distractors: ['pen', 'hat', 'hot', 'men'] },
  { id: 'cvc12', word: 'log', clue: ['l', 'o', 'g'], category: 'cvc', emoji: '🪵', distractors: ['leg', 'dog', 'lid', 'lot'] },
  { id: 'cvc13', word: 'mop', clue: ['m', 'o', 'p'], category: 'cvc', emoji: '🧹', distractors: ['map', 'mud', 'hop', 'pop'] },
  { id: 'cvc14', word: 'bus', clue: ['b', 'u', 's'], category: 'cvc', emoji: '🚌', distractors: ['bug', 'bad', 'bed', 'tub'] },
  { id: 'cvc15', word: 'van', clue: ['v', 'a', 'n'], category: 'cvc', emoji: '🚐', distractors: ['can', 'vet', 'pan', 'run'] },
  { id: 'cvc16', word: 'bed', clue: ['b', 'e', 'd'], category: 'cvc', emoji: '🛏️', distractors: ['bad', 'red', 'bug', 'fed'] },
  { id: 'cvc17', word: 'bag', clue: ['b', 'a', 'g'], category: 'cvc', emoji: '🎒', distractors: ['bug', 'rag', 'big', 'bat'] },
  { id: 'cvc18', word: 'pen', clue: ['p', 'e', 'n'], category: 'cvc', emoji: '🖊️', distractors: ['pin', 'hen', 'pan', 'pet'] },
  { id: 'cvc19', word: 'box', clue: ['b', 'o', 'x'], category: 'cvc', emoji: '📦', distractors: ['fox', 'bag', 'boy', 'six'] },
  { id: 'cvc20', word: 'wig', clue: ['w', 'i', 'g'], category: 'cvc', emoji: '🦱', distractors: ['pig', 'wet', 'wag', 'win'] },
  { id: 'cvc21', word: 'sad', clue: ['s', 'a', 'd'], category: 'cvc', emoji: '😢', distractors: ['mad', 'sun', 'sit', 'dad'] },
  { id: 'cvc22', word: 'run', clue: ['r', 'u', 'n'], category: 'cvc', emoji: '🏃', distractors: ['sun', 'rub', 'rag', 'ran'] },
  { id: 'cvc23', word: 'hot', clue: ['h', 'o', 't'], category: 'cvc', emoji: '🥵', distractors: ['hat', 'hit', 'hop', 'not'] },
  { id: 'cvc24', word: 'wet', clue: ['w', 'e', 't'], category: 'cvc', emoji: '💦', distractors: ['net', 'wig', 'web', 'jet'] }
];

export const BLEND_WORDS: WordItem[] = [
  // CCVC
  { id: 'blend1', word: 'frog', category: 'blend', emoji: '🐸', distractors: ['flag', 'fret', 'log', 'drag'] },
  { id: 'blend2', word: 'crab', category: 'blend', emoji: '🦀', distractors: ['crib', 'cab', 'grab', 'crop'] },
  { id: 'blend3', word: 'flag', category: 'blend', emoji: '🏁', distractors: ['frog', 'flat', 'bag', 'flap'] },
  { id: 'blend4', word: 'plum', category: 'blend', emoji: '🍇', distractors: ['drum', 'slug', 'pump', 'plan'] }, // Grape or Plum style
  { id: 'blend5', word: 'drum', category: 'blend', emoji: '🥁', distractors: ['drop', 'plum', 'drag', 'dust'] },
  { id: 'blend6', word: 'stop', category: 'blend', emoji: '🛑', distractors: ['step', 'spot', 'top', 'shop'] },
  { id: 'blend7', word: 'swan', category: 'blend', emoji: '🦢', distractors: ['swim', 'swam', 'sweet', 'soft'] },
  { id: 'blend8', word: 'drop', category: 'blend', emoji: '💧', distractors: ['drip', 'drum', 'crop', 'flop'] },
  { id: 'blend9', word: 'swim', category: 'blend', emoji: '🏊', distractors: ['swam', 'trim', 'slip', 'slim'] },
  { id: 'blend10', word: 'clip', category: 'blend', emoji: '📎', distractors: ['clap', 'slip', 'clam', 'chip'] },
  // CVCC
  { id: 'blend11', word: 'tent', category: 'blend', emoji: '⛺', distractors: ['tent', 'bent', 'nest', 'test'] },
  { id: 'blend12', word: 'belt', category: 'blend', emoji: '🎗️', distractors: ['belt', 'best', 'bell', 'melt'] },
  { id: 'blend13', word: 'lamp', category: 'blend', emoji: '💡', distractors: ['camp', 'ramp', 'limp', 'lump'] },
  { id: 'blend14', word: 'hand', category: 'blend', emoji: '✋', distractors: ['sand', 'band', 'hard', 'wind'] },
  { id: 'blend15', word: 'nest', category: 'blend', emoji: '🪺', distractors: ['best', 'next', 'net', 'test'] },
  { id: 'blend16', word: 'wind', category: 'blend', emoji: '💨', distractors: ['wing', 'sand', 'pond', 'wild'] },
  { id: 'blend17', word: 'milk', category: 'blend', emoji: '🥛', distractors: ['silk', 'mask', 'melt', 'pink'] },
  { id: 'blend18', word: 'ring', category: 'blend', emoji: '💍', distractors: ['wing', 'sing', 'king', 'sink'] },
  { id: 'blend19', word: 'sink', category: 'blend', emoji: '🚰', distractors: ['wink', 'sink', 'pink', 'ring'] },
  { id: 'blend20', word: 'gift', category: 'blend', emoji: '🎁', distractors: ['lift', 'raft', 'soft', 'grift'] },
  { id: 'blend21', word: 'desk', category: 'blend', emoji: '✍️', distractors: ['disk', 'deck', 'dust', 'mask'] },
  { id: 'blend22', word: 'sand', category: 'blend', emoji: '🏖️', distractors: ['sand', 'pond', 'band', 'hand'] },
  { id: 'blend23', word: 'pond', category: 'blend', emoji: '🏞️', distractors: ['pond', 'pink', 'sand', 'hand'] },
  { id: 'blend24', word: 'pink', category: 'blend', emoji: '🌸', distractors: ['pink', 'sink', 'pond', 'wink'] }
];

export const DIGRAPH_WORDS: WordItem[] = [
  { id: 'dig1', word: 'fish', category: 'digraph', emoji: '🐟', distractors: ['dish', 'fist', 'ship', 'fin'] },
  { id: 'dig2', word: 'duck', category: 'digraph', emoji: '🦆', distractors: ['deck', 'buck', 'luck', 'dust'] },
  { id: 'dig3', word: 'ship', category: 'digraph', emoji: '🚢', distractors: ['shop', 'chip', 'slip', 'dish'] },
  { id: 'dig4', word: 'shell', category: 'digraph', emoji: '🐚', distractors: ['bell', 'shed', 'shelf', 'shack'] },
  { id: 'dig5', word: 'chick', category: 'digraph', emoji: '🐥', distractors: ['chick', 'thick', 'click', 'chin'] },
  { id: 'dig6', word: 'chip', category: 'digraph', emoji: '🍟', distractors: ['chop', 'ship', 'clip', 'chin'] },
  { id: 'dig7', word: 'chop', category: 'digraph', emoji: '🪓', distractors: ['chop', 'chip', 'shop', 'crop'] },
  { id: 'dig8', word: 'thin', category: 'digraph', emoji: '🧍', distractors: ['chin', 'shin', 'than', 'pin'] },
  { id: 'dig9', word: 'whip', category: 'digraph', emoji: '🍦', distractors: ['whip', 'ship', 'chip', 'skip'] }, // Whipped cream
  { id: 'dig10', word: 'sock', category: 'digraph', emoji: '🧦', distractors: ['sack', 'rock', 'lock', 'sick'] },
  { id: 'dig11', word: 'lock', category: 'digraph', emoji: '🔒', distractors: ['rock', 'sock', 'luck', 'lack'] },
  { id: 'dig12', word: 'path', category: 'digraph', emoji: '🛣️', distractors: ['math', 'bath', 'patch', 'pan'] },
  { id: 'dig13', word: 'moth', category: 'digraph', emoji: '🦋', distractors: ['moth', 'mouth', 'math', 'moss'] },
  { id: 'dig14', word: 'shoe', category: 'digraph', emoji: '👟', distractors: ['shop', 'shed', 'show', 'shack'] },
  { id: 'dig15', word: 'rich', category: 'digraph', emoji: '💰', distractors: ['rock', 'rush', 'ring', 'itch'] },
  { id: 'dig16', word: 'sing', category: 'digraph', emoji: '🎤', distractors: ['song', 'wing', 'ring', 'sink'] },
  { id: 'dig17', word: 'wing', category: 'digraph', emoji: '🪶', distractors: ['ring', 'sing', 'wind', 'wig'] },
  { id: 'dig18', word: 'shack', category: 'digraph', emoji: '🛖', distractors: ['sack', 'shack', 'shell', 'black'] }
];

export const ADVANCED_WORDS: WordItem[] = [
  // Vowel Teams
  { id: 'adv1', word: 'boat', category: 'advanced', emoji: '⛵', distractors: ['boot', 'coat', 'goat', 'bat'], hint: 'oa digraph makes the long /o/ sound' },
  { id: 'adv2', word: 'rain', category: 'advanced', emoji: '🌧️', distractors: ['train', 'brain', 'ran', 'pain'], hint: 'ai makes the long /a/ sound' },
  { id: 'adv3', word: 'sweet', category: 'advanced', emoji: '🍬', distractors: ['sweet', 'sweat', 'sheet', 'seed'], hint: 'ee makes the long /e/ sound' },
  { id: 'adv4', word: 'train', category: 'advanced', emoji: '🚆', distractors: ['rain', 'brain', 'trail', 'tram'], hint: 'ai makes the long /a/ sound' },
  { id: 'adv5', word: 'sheep', category: 'advanced', emoji: '🐑', distractors: ['ship', 'sheet', 'sleep', 'shack'], hint: 'ee makes the long /e/ sound' },
  { id: 'adv6', word: 'goat', category: 'advanced', emoji: '🐐', distractors: ['boat', 'coat', 'gate', 'good'], hint: 'oa makes the long /o/ sound' },
  { id: 'adv7', word: 'leaf', category: 'advanced', emoji: '🍃', distractors: ['leaf', 'loaf', 'lead', 'left'], hint: 'ea makes the long /e/ sound' },
  { id: 'adv8', word: 'book', category: 'advanced', emoji: '📖', distractors: ['boot', 'look', 'back', 'cook'], hint: 'oo makes the short /oo/ sound' },
  { id: 'adv9', word: 'moon', category: 'advanced', emoji: '🌙', distractors: ['moon', 'spoon', 'man', 'noon'], hint: 'oo makes the long /oo/ sound' },
  { id: 'adv10', word: 'tree', category: 'advanced', emoji: '🌳', distractors: ['three', 'free', 'toy', 'tray'], hint: 'ee makes the long /e/ sound' },
  { id: 'adv11', word: 'snail', category: 'advanced', emoji: '🐌', distractors: ['sail', 'snake', 'soil', 'tail'], hint: 'ai makes the long /a/ sound' },
  { id: 'adv12', word: 'snow', category: 'advanced', emoji: '❄️', distractors: ['show', 'blow', 'slow', 'snip'], hint: 'ow makes the long /o/ sound' },
  { id: 'adv13', word: 'house', category: 'advanced', emoji: '🏠', distractors: ['mouse', 'horse', 'home', 'hose'], hint: 'ou makes the /ow/ sound' },
  { id: 'adv14', word: 'coin', category: 'advanced', emoji: '🪙', distractors: ['corn', 'cone', 'can', 'join'], hint: 'oi makes the /oy/ sound' },
  { id: 'adv15', word: 'boy', category: 'advanced', emoji: '👦', distractors: ['toy', 'box', 'bag', 'bay'], hint: 'oy makes the /oy/ sound' },
  { id: 'adv16', word: 'cloud', category: 'advanced', emoji: '☁️', distractors: ['clown', 'cold', 'clay', 'loud'], hint: 'ou makes the /ow/ sound' },
  { id: 'adv17', word: 'paint', category: 'advanced', emoji: '🎨', distractors: ['paint', 'point', 'pant', 'rain'], hint: 'ai makes the long /a/ sound' },
  // Multisyllabic
  { id: 'adv18', word: 'playground', category: 'advanced', emoji: '🛝', distractors: ['playground', 'playhouse', 'playpen', 'ground'], syllables: ['play', 'ground'] },
  { id: 'adv19', word: 'sunset', category: 'advanced', emoji: '🌇', distractors: ['sunflower', 'sunset', 'sunrise', 'sunday'], syllables: ['sun', 'set'] },
  { id: 'adv20', word: 'rabbit', category: 'advanced', emoji: '🐇', distractors: ['rabbit', 'robin', 'habit', 'ribbon'], syllables: ['rab', 'bit'] },
  { id: 'adv21', word: 'cactus', category: 'advanced', emoji: '🌵', distractors: ['cactus', 'cat', 'canvas', 'cottage'], syllables: ['cac', 'tus'] },
  { id: 'adv22', word: 'muffin', category: 'advanced', emoji: '🧁', distractors: ['muffin', 'puppet', 'mitten', 'coffin'], syllables: ['muf', 'fin'] },
  { id: 'adv23', word: 'backpack', category: 'advanced', emoji: '🎒', distractors: ['backpack', 'backyard', 'package', 'pocket'], syllables: ['back', 'pack'] },
  { id: 'adv24', word: 'laptop', category: 'advanced', emoji: '💻', distractors: ['laptop', 'letter', 'table', 'desktop'], syllables: ['lap', 'top'] },
  { id: 'adv25', word: 'sunflower', category: 'advanced', emoji: '🌻', distractors: ['sunflower', 'sunscreen', 'flower', 'sunset'], syllables: ['sun', 'flow', 'er'] }
];

export const HEART_WORDS: WordItem[] = [
  // heartParts specifies the character index of irregular vowels/consonants that do not decode standardly.
  // We draw a visual tiny pink heart above this letter index inside the word layout!
  { id: 'heart1', word: 'the', category: 'heart', emoji: '🎁', distractors: ['they', 'then', 'that', 'this'], heartParts: [2], hint: 'The "e" says the schwa sound /uh/.' },
  { id: 'heart2', word: 'The', category: 'heart', emoji: '📦', distractors: ['They', 'Then', 'To', 'He'], heartParts: [2], hint: 'The "e" says the schwa sound /uh/.' },
  { id: 'heart3', word: 'my', category: 'heart', emoji: '🙋', distractors: ['me', 'may', 'try', 'by'], heartParts: [1], hint: 'The "y" says the long /i/ sound.' },
  { id: 'heart4', word: 'My', category: 'heart', emoji: '🎒', distractors: ['Me', 'May', 'We', 'She'], heartParts: [1], hint: 'The "y" says the long /i/ sound.' },
  { id: 'heart5', word: 'I', category: 'heart', emoji: '🧍', distractors: ['in', 'is', 'it', 'if'], heartParts: [0], hint: 'Just one uppercase is read as the word I.' },
  { id: 'heart6', word: 'he', category: 'heart', emoji: '👦', distractors: ['we', 'she', 'here', 'her'], heartParts: [1], hint: 'The "e" makes its long vowel name /ee/ directly.' },
  { id: 'heart7', word: 'she', category: 'heart', emoji: '👧', distractors: ['he', 'we', 'see', 'shy'], heartParts: [2], hint: 'The "e" makes its long vowel name /ee/ directly.' },
  { id: 'heart8', word: 'we', category: 'heart', emoji: '🧑‍🤝‍🧑', distractors: ['me', 'he', 'she', 'wet'], heartParts: [1], hint: 'The "e" makes its long vowel name /ee/ directly.' },
  { id: 'heart9', word: 'was', category: 'heart', emoji: '🕒', distractors: ['has', 'wax', 'want', 'with'], heartParts: [1, 2], hint: 'The "a" says /uh/ and "s" says /z/.' },
  { id: 'heart10', word: 'to', category: 'heart', emoji: '➡️', distractors: ['do', 'two', 'too', 'so'], heartParts: [1], hint: 'The "o" says the /oo/ sound.' },
  { id: 'heart11', word: 'do', category: 'heart', emoji: '✅', distractors: ['to', 'go', 'so', 'no'], heartParts: [1], hint: 'The "o" says the /oo/ sound.' }
];

export function getWordListForLevel(level: GameLevel): WordItem[] {
  switch (level) {
    case 1:
      return CVC_WORDS;
    case 2:
      return BLEND_WORDS;
    case 3:
      return DIGRAPH_WORDS;
    case 4:
      return ADVANCED_WORDS;
    case 'heart':
      return HEART_WORDS;
    case 'first-sound':
      return CVC_WORDS;
    default:
      return CVC_WORDS;
  }
}

/**
 * Returns a word item and an array of 4 WordItems (the target + 3 distractors) randomly shuffled.
 */
export function generateQuestion(level: GameLevel, previousId?: string): { target: WordItem; choices: WordItem[] } {
  if (level === 'first-sound') {
    const allWords = [...CVC_WORDS, ...BLEND_WORDS, ...DIGRAPH_WORDS, ...ADVANCED_WORDS];
    const wordsByLetter: Record<string, WordItem[]> = {};
    
    allWords.forEach(w => {
      const fl = w.word[0].toLowerCase();
      if (/^[a-z]$/.test(fl)) {
        if (!wordsByLetter[fl]) {
          wordsByLetter[fl] = [];
        }
        wordsByLetter[fl].push(w);
      }
    });

    const lettersWithWords = Object.keys(wordsByLetter);
    let availableLetters = lettersWithWords.filter(l => `first-sound-${l}` !== previousId);
    if (availableLetters.length === 0) {
      availableLetters = lettersWithWords;
    }

    const tLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];
    const upperLetter = tLetter.toUpperCase();

    const target: WordItem = {
      id: `first-sound-${tLetter}`,
      word: upperLetter,
      category: 'cvc',
      emoji: upperLetter,
      distractors: [],
      clue: [upperLetter]
    };

    const correctPool = wordsByLetter[tLetter];
    const correctWord = correctPool[Math.floor(Math.random() * correctPool.length)];

    const distractorPool = allWords.filter(w => w.word[0].toLowerCase() !== tLetter);
    const shuffledDistractors = [...distractorPool].sort(() => Math.random() - 0.5);
    
    const uniqueDistractorChoices: WordItem[] = [];
    const chosenLetters = new Set<string>([tLetter]);

    for (const dist of shuffledDistractors) {
      const dLetter = dist.word[0].toLowerCase();
      if (!chosenLetters.has(dLetter)) {
        chosenLetters.add(dLetter);
        uniqueDistractorChoices.push(dist);
        if (uniqueDistractorChoices.length === 3) break;
      }
    }

    while (uniqueDistractorChoices.length < 3) {
      const fallback = distractorPool.find(w => !uniqueDistractorChoices.some(ud => ud.id === w.id));
      if (!fallback) break;
      uniqueDistractorChoices.push(fallback);
    }

    const choices = [correctWord, ...uniqueDistractorChoices].sort(() => Math.random() - 0.5);

    return { target, choices };
  }

  const pool = getWordListForLevel(level);
  
  // Filter out the previous word if possible to avoid immediate repeating
  let available = pool.filter((w) => w.id !== previousId);
  if (available.length === 0) {
    available = pool;
  }
  
  // Pick a random target word
  const target = available[Math.floor(Math.random() * available.length)];
  
  // Assemble distractors
  // We want to try finding distractors inside the same level, making sure we don't pick the target itself
  const distractorsPool = pool.filter((w) => w.word.toLowerCase() !== target.word.toLowerCase());
  
  // Shuffle distractors list and take 3
  const shuffledDistractors = [...distractorsPool].sort(() => Math.random() - 0.5);
  const selectedDistractors = shuffledDistractors.slice(0, 3);
  
  // If we don't have enough distractors, grab some from Level 1
  while (selectedDistractors.length < 3) {
    const fallback = CVC_WORDS.filter((w) => w.word !== target.word && !selectedDistractors.some(sd => sd.word === w.word));
    if (fallback.length === 0) break;
    selectedDistractors.push(fallback[Math.floor(Math.random() * fallback.length)]);
  }
  
  // Combine target and distractors
  const choices = [target, ...selectedDistractors];
  
  // Shuffle the choices
  const shuffledChoices = choices.sort(() => Math.random() - 0.5);
  
  return {
    target,
    choices: shuffledChoices
  };
}
