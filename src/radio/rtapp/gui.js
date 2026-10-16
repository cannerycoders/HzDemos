// This module builds checkpoints for provided radio stations.
// stations assumed to be an array of [url, name].
// onChange is a potentially async function that response
// to the checkboxes being toggled.
exports.BuildRadioButtons = function(stations, onChange, state)
{
  let content = globalThis.document.querySelector(".Content");
  let html = ["<div id='Radio' style='padding:10px'>"];
  html.push("<h3 style='padding-bottom:10px'>Sounds of the World",
    "<span style='display:inline-block;font-size:.6em;font-weight:normal;font-style:italic;color:#444;'>",
      "stations may have intermittent service.",
    "</span> </h3>");
  html.push("<div style='padding:10px'>");
  for (let i = 0;i < stations.length; i++)
  {
    let s = stations[i];
    html.push(`
      <div style="padding-left:10px">
      <input type="checkbox" id="cb_${i}"> <span>${s[1]}</span>
      </div>
    `);
  }
  html.push("</div>",
    `<div id='headlines' 
      style='font-size:11px;font-weight:normal;font-style:italic;color:#444;'>
      tuning, loading...
    </div>`,
  );
  content.insertAdjacentHTML("afterbegin", html.join("\n"));
  let headlines = content.querySelector("#headlines");
  let mydiv = content.querySelector("#Radio");
  for (let cb of mydiv.querySelectorAll("input"))
  {
    cb.addEventListener("change", async(evt) =>
    {
      let i = parseInt(evt.target.id.substr(3));
      onChange(i, evt.target.checked, state);
    });
  }
  return headlines;
};

exports.ToggleStation = function(i)
{
  let cb = globalThis.document.querySelector(`#cb_${i}`);
  cb.click();
};