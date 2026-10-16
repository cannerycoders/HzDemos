// This module emits anode notes corresponding to morse code.
// The perform method is an async generator.

const s_codeMap = 
{
  'A': '.-',
  'B': '-...',  
  'C': '-.-.',  
  'D': '-..', 
  'E': '.', 
  'F': '..-.', 
  'G': '--.', 
  'H': '....', 
  'I': '..', 
  'J': '.---', 
  'K': '-.-', 
  'L': '.-..',
  'M': '--', 
  'N': '-.', 
  'O': '---', 
  'P': '.--.', 
  'Q': '--.-', 
  'R': '.-.', 
  'S': '...', 
  'T': '-', 
  'U': '..-', 
  'V': '...-', 
  'W': '.--', 
  'X': '-..-',
  'Y': '-.--', 
  'Z': '--..', 
  '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', 
  '7': '--...', '8': '---..', '9': '----.', '0': '-----', 
  ',': '--..--',
  '.': '.-.-.-', 
  '?': '..--..',
  '!': '-.-.--', // non-standard
  '/': '-..-.', 
  '-': '-....-', 
  '(': '-.--.', 
  ')': '-.--.-',
  ' ': '|', // <<-- inter-word
  "'": ".----."
};

const s_codeList = Object.fromEntries(
  Object.entries(s_codeMap).map(([key, val]) =>
  {
    let nval = val.split("");
    return [key, nval];
  }));

// console.log(JSON.stringify(s_codeList));

// wikipedia: timing and spacings.
//  dur of dot is 1
//  dur of dash = 3
//  dur of intra-char units is 1 
//  dur of inter-char units is 3
//  dur of inter-word ('|') units is 7

const s_durs = 
{
  ".": 1,
  "-": 3,
  "|": 7,
  "^": 3, // inter-char
  // unimplemented
  ':': 0,
  "'": 0,
};

class Morse
{
  // standard freq is around 600 hz which is close to midi D5
  constructor(mnote = 74, minDur = .1)
  {
    this.mnote = mnote; // hz
    this.minDur = minDur; // seconds
  }
    
  /* PeroformText is an async generator that can be invoked thus:
     *
     *  for await (const value of morse.PerformText(s, i, "hello")) 
     *      console.log(value);
     */
  async * PerformText(scene, inst, text, verbose = 1)
  {
    // m is an array of length words, of arrays of length ~ dotdash.
    let m = this.fromText(text); 
    if (verbose)
      console.log(`${text} ${m.join("")}`);
    let oneDur = scene.Seconds(this.minDur);
    let intraCharDur = oneDur; // dots withih a char
    let intraWordDur = s_durs["|"] * oneDur;
    try 
    {
      for (let i = 0;i < m.length;i++)
      {
        let xmit = m[i]; // an array of chars
        if (verbose > 1)
          console.log(`${text[i]} (${xmit.join("")})`);
        for (let i = 0;i < xmit.length;i++) // xmit is string
        {
          let n = xmit[i];
          let dur = s_durs[n];
          if (dur == null || dur == 0)
          {
            // uniplemented chars: :, ',
            if (dur == null)
                            console.log(`no dur for: ${n}`);
            continue;
          }
          if (n == '|')
          {
            yield scene.Wait(intraWordDur);
          }
          else
          {
            let ndur = dur * oneDur;
            inst.NoteOn(this.mnote, .7 + .3 * Math.random());
            // console.log("yield/wait " + ndur);
            yield scene.Wait(ndur);
            inst.NoteOff(this.mnote, 1);
            if (i < xmit.length)
            {
              // console.log("yield2/wait " + intraCharDur);
              yield scene.Wait(intraCharDur); // inter char
            }
          }
        }
        // console.log("yield2/wait " + intraCharDur);
        yield scene.Wait(intraCharDur); 
      }
      yield scene.Wait(intraWordDur);
    }
    catch (err)
    {
      console.warn("Morse error with quote " + err);
    };
  }
    
  // we return an array whose length is ~ number of letters
  // each letter is represented by an array of its constinuents (dot, dash).
  fromText(text)
  {
    let morse = Array.from(text.trim().toUpperCase());
    return morse.map((char) =>
    {
      if (s_codeList[char])
        return s_codeList[char];
      else
        return char;
            
    });
    return morse;
  }
}

exports.Morse = Morse;


// if (false)
// {
//   let m = new Morse();
//   await m.PerformFeed("Zen Quote");
// }