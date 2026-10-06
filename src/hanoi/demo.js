async function demo(fiberCtx)
{
  const help = `
// This demo is inspired by a ChucK example found here:
//     https://chuck.stanford.edu/doc/examples/hanoi2.ck.
//  It was developed by Ge Wang and the ChucK team.
//
// In the context of Hz, it shows how we can use the 
// combination of the Hz audio engine and the web browser
// graphics engine to perform, sonify and visualize a
// computational process.
//
// The Tower of Hanoi problem is a classic puzzle posed
// to students of computer science.
//
// From wikipedia:
//
// The puzzle begins with the disks stacked on one rod in order of 
// decreasing size, the smallest at the top, thus approximating a 
// conical shape. The objective of the puzzle is to move the entire 
// stack to one of the other rods, obeying the following rules:
//  - Only one disk may be moved at a time.
//  - Each move consists of taking the upper disk from one of the 
//    stacks and placing it on top of another stack or on an empty rod.
//  - No disk may be placed on top of a disk that is smaller than it.
// 
`;
  const {Ascene, path, SVG} = globalThis;
  let scene = await Ascene.BeginFiber(fiberCtx); 
  let dac = scene.GetDAC();
  dac.Show();
  let samplo = await scene.NewAnode("Hz.Samplo", {name:"hanoi"});
  samplo.Show();
  let scope = await scene.NewAnode("Hz.Scope");
  scope.Show();
  let verb = await scene.NewAnode("Hz.ConvVerb");
  await verb.LoadPreset({
    Wet: 1,
    Dry: .75
  });
  verb.Show();
  scene.Chain(samplo, scope, verb, dac);

  // initialize samplo with some samples
  let files = ["data/kick.wav", "data/snare-chili.wav", "data/snare-hop.wav"];
  await samplo.LoadPreset({
    instrument: {
      kit: "Workspace", 
      inst: files
    },
    Gain: 1.5
  });

  // the hanoi --------------------------------------
  const numdisks = 10;
  const wait = scene.Seconds(.15); 
  const asap = 0;
  let noteid;
  let pans = [.0, .5, .9];
  let steps = 0;

  async function hanoi(num, src, dst, other)
  {
    steps++;
    // move all except the biggest
    if (num > 1) 
      await hanoi(num - 1, src, other, dst); // recur

    // Sonify the move by playing a sound for the dst peg.
    // We could get fancier and play different sounds according
    // to disk radius using the current disk states maintained 
    // by visualizer.
    let velocity = .2 + .7 * Math.random();
    let pan = pans[dst];
    noteid = samplo.Note(dst, velocity, wait, asap)[0];
    // console.log(dst, pan, noteid);
    samplo.NoteExpression("pan", pan, 0, noteid);
    updateVisualization(src, dst);
    await scene.Wait(wait);
    
    // move onto the biggest
    if (num > 1) 
      await hanoi(num - 1, other, dst, src); // recur
  }

  /* support for visualization -------------------------------------- */
  function randomColor()
  {
    let r = Math.round(20 + 180 * Math.random());
    let g = Math.round(20 + 180 * Math.random());
    let b = Math.round(20 + 180 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  // Hz's JavaScript sandbox exposes WWW DOM via the 
  // standard document object. Therein, the .Content div
  // is pre-created to hold WAM plugins. We'll use builtin
  // SVG (https://svgjs.dev) to create colored rectangles.
  // These will be added to .Content.
  let [xsize, ysize] = [400, 150];
  let svg = SVG().addTo('.Content').size(xsize, ysize);
  svg.text().plain("Ge Wang's Tower of Annoy").fill("orange").move(10, 20);
  
  // make y point up
  let draw = svg.group().transform({scale:[1, -1], translate:[0, ysize]});
  let height = 10;
  let spacing = height + 2;
  let maxrad = 110;
  let centerX = [maxrad / 2, maxrad * 1.5, maxrad * 2.5];
  let disklist = []; // contains our svg rects for each disk
  for (let i = 0;i < numdisks;i++)
  {
    disklist[i] = draw.rect(10 + i * 10, height)
                  .fill(randomColor());
  }

  // initial conditions
  const pegstacks = [[], [], []]; // holds the current disk stack for each peg
  for (let i = 0;i < numdisks;i++) 
    pegstacks[0].unshift(i); // largest disk on bottom of first stack

  function updateVisualization(src, dst)
  {
    let d = pegstacks[src].pop(); // take the disk off src peg
    pegstacks[dst].push(d); // push it onth the dst peg.
    // rebuild state
    for (let i = 0;i < pegstacks.length;i++) // for each peg
    {
      let ps = pegstacks[i];
      let pegx = centerX[i];
      for (let j = 0;j < ps.length;j++)
      {
        let d = disklist[ps[j]]; // ps[j] is id/radius, d is svg rect
        d.cx(pegx).y(j * spacing); // move it into position.
      }
    }
  }

  let content = document.querySelector(".Content");
  content.insertAdjacentHTML("beforeend", `<pre style="padding:10px">${help}</pre>`);

  // start it
  await hanoi(numdisks, 0, 2, 1);

  console.info(`hanoi done! ${steps} steps`);

  await(scene.Seconds(2)); // for reverb to die down
}

let src = demo.toString();

export const DemoScript = `
  let fn = (${src});
  fn(this);
`;