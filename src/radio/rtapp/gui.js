// This module builds checkpoints for provided radio stations.
// stations assumed to be an array of [url, name].
// onChange is a potentially async function that response
// to the checkboxes being toggled.
exports.BuildRadioButtons = function(stations, onChange, state)
{
  let content = globalThis.document.querySelector(".Content");
  let html = ["<div id='Radio' style='padding-bottom:10px'>"];
  html.push("<h3>Radio Streams from around the World.</h3>");
  for (let i = 0;i < stations.length; i++)
  {
    let s = stations[i];
    html.push(`
      <div>
      <input type="checkbox" id="cb_${i}"> <span>${s[1]}</span>
      </div>
    `);
  }
  html.push("</div>");
  content.insertAdjacentHTML("afterbegin", html.join("\n"));
  let mydiv = content.querySelector("#Radio");
  for (let cb of mydiv.querySelectorAll("input"))
  {
    cb.addEventListener("change", async(evt) =>
    {
      let i = parseInt(evt.target.id.substr(3));
      onChange(i, evt.target.checked, state);
    });
  }
};

exports.ToggleStation = function(i)
{
  let cb = globalThis.document.querySelector(`#cb_${i}`);
  cb.click();
};