import launch from "puppeteer"
import fetch from "node-fetch"

async function getNewTime() {
  const browser = await launch({
    args: ["--disable-dev-shm-usage","--no-sandbox"]
  })
  const page = await browser.newPage()
  await page.goto("https://bokapass.nemoq.se/Booking/Booking/Index/vastragotaland")
  await page.click(".btn-primary")
  await page.waitForSelector("#AcceptInformationStorage")
  await page.click("#AcceptInformationStorage")
  await page.click("input.btn")
  await page.waitForSelector("label.radio:nth-child(1) > input:nth-child(1)")
  await page.click("label.radio:nth-child(1) > input:nth-child(1)")
  await page.click("input.btn")
  await page.waitForSelector("div.controls:nth-child(1) > input:nth-child(2)")
  await page.click("div.controls:nth-child(1) > input:nth-child(2)")
  await page.waitForSelector("div.container-fluid:nth-child(7)")
  const date = await page.evaluate(() => {
    return document.querySelector("#datepicker").value
  })
  console.log(date)
  let month = date.split("-")[1]
  let text = await page.evaluate(() => {
    return document.querySelector("div.container-fluid:nth-child(7)").innerText
  })

  let tsplit = text.split(/\n(?=[A-Z|Å|Ä|Ö])/).filter(x => x.includes(":"))
  let towrite = tsplit.join("\n").replaceAll(/\n+/g, "\n")

  if (month < 7) {
    let params = {
      "content": null,
      "embeds": [
        {
          "title": date,
          "description": towrite,
          "color": 65402,
          "author": {
            "name": "Boka",
            "url": "https://bokapass.nemoq.se/Booking/Booking/Index/vastragotaland/"
          }
        }
      ]
    }
    fetch("https://discord.com/api/webhooks/953727356722360330/9qd8Q7cjgN5l5utv8S2z22XszI11Ky7yo_275mQOzxwBv25fpzZjonqlpg_11La7NW29", {
      method: "POST",
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(params)
    })
  }
  
  // fs.writeFileSync(date+".txt", towrite)
  // await page.screenshot({path: "example.png"})
  await browser.close()
}

getNewTime()
setInterval(getNewTime, 5 * 60 * 1000) //Runs every five minutes