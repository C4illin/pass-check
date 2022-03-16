const puppeteer = require("puppeteer")
const fs = require("fs");

// https://bokapass.nemoq.se/Booking/Booking/Index/vastragotaland
async function getNewTime() {
  const browser = await puppeteer.launch({
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
  const text = await page.evaluate(() => {
    return document.querySelector("div.container-fluid:nth-child(7)").innerText
  })
  fs.writeFileSync(date+".txt", text)
  await page.screenshot({path: "example.png"})
  await browser.close()
}

getNewTime()

