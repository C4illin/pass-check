import puppeteer from "puppeteer"
import fetch from "node-fetch"

async function setupBrowser() {
  const browser = await puppeteer.launch({
    args: ["--disable-dev-shm-usage","--no-sandbox"]
  })
  const page = await browser.newPage()
  console.log("Browser started")
  page.setDefaultNavigationTimeout(0)
  await page.goto("https://bokapass.nemoq.se/Booking/Booking/Index/vastragotaland")
  await page.click(".btn-primary")
  await page.waitForSelector("#AcceptInformationStorage", {timeout: 0})
  await page.click("#AcceptInformationStorage")
  await page.click("input.btn")
  await page.waitForSelector("label.radio:nth-child(1) > input:nth-child(1)", {timeout: 0})
  await page.click("label.radio:nth-child(1) > input:nth-child(1)")
  await page.click("input.btn")
  await page.waitForSelector("div.controls:nth-child(1) > input:nth-child(2)", {timeout: 0})
  console.log("Login completed")

  let runCount = 0
  let lastDate = 0
  let allowOne = true
  async function getNewTime() {
    runCount++
    console.log(runCount)
    await page.click("div.controls:nth-child(1) > input:nth-child(2)")
    await page.waitForSelector("div.container-fluid:nth-child(7)", {timeout: 0})
    const date = await page.evaluate(() => {
      return document.querySelector("#datepicker").value
    })
    console.log(date)
    let month = date.split("-")[1]

    if (month < 7 && lastDate != date) {
      lastDate = date
      let text = await page.evaluate(() => {
        return document.querySelector("div.container-fluid:nth-child(7)").innerText
      })
  
      let tsplit = text.split(/\n(?=[A-Z|Å|Ä|Ö])/).filter(x => x.includes(":"))
      let towrite = tsplit.join("\n").replaceAll(/\n+/g, "\n")

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

    // Restart browser completely
    if (runCount >= 100 && allowOne) {
      allowOne == false
      clearInterval(repeater)
      await browser.close()
      console.log("Browser closed")
      setupBrowser()
    }
  }

  // Run once
  getNewTime()
  let repeater = setInterval(getNewTime, 30 * 1000)
}

// Run once
setupBrowser()