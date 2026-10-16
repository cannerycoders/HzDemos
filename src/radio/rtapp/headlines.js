// this module loads bbc headlines and zenquotes.
async function headlines(maxlen)
{
  let headlines = [];
  try
  {
    let dom = await Util.FetchURL("https://feeds.bbci.co.uk/news/world/rss.xml", "xml");
    for (let i of dom.querySelectorAll("item"))
    {
      let headline = i.querySelector("title").textContent;
      headlines.push(headline);
      if (headlines.length > maxlen)
        break;
    }
  }
  catch (err)
  {}
  try
  {
    let zquote = await Util.FetchURL("https://zenquotes.io/api/random", "json");
    let z = zquote[0];
    headlines.push(`${z.a}: ${z.q}`);
  }
  catch (err)
  {}

  return Random.Shuffle(headlines).slice(0, maxlen);
};

exports.Headlines = headlines;