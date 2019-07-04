import $ from "../lib/jquery.min";

export async function wait({ millseconds }) {
  return new Promise(resolve => {
    setTimeout(resolve, millseconds);
  });
}

export async function fetchHTML(url) {
  try {
    const res = await fetch(url);
    const html = await res.text();
    return html;
  } catch (err) {
    console.log("err", err);
  }
}

function getSkills(html) {
  let re = /<span id="skillNames">(.*)<\/span>/i;
  if (re.exec(html)) {
    return re.exec(html)[1];
  }
  return "No skills found";
}

function getNoOfInternships(html) {
  let re = /<span id="number_of_internships_available".*>(.*)<\/span>/i;
  if (re.exec(html)) {
    return re.exec(html)[1];
  }
  return "No data found";
}

function parseStipendString(stipend) {
  return stipend
    .replace(/[^0-9-]/gi, "") // replace all non digit except "-" by ""
    .split("-") // split by "-"
    .map(parseFloat) // parse the number from string
    .filter(val => !isNaN(val)) // filter for NaN
    .sort((a, b) => a - b) // sort by desc order
    .pop(); // get the largest (first) element
}

function getStipend(html) {
  let re = /<\/h5>INR(.*) \/.*<br>/i;

  if (re.exec(html)) {
    return parseStipendString(re.exec(html)[1]);
  }
  return "No data found";
}

export async function getProperties(url) {
  let properties = {};
  try {
    const html = await fetchHTML(url);
    properties.skills = getSkills(html);
    properties.noOfInternships = getNoOfInternships(html);
    properties.stipend = getStipend(html);
  } catch (err) {
    properties.skills = "Failed to load";
    properties.noOfInternships = "Failed to load";
  }
  return properties;
}

export async function getInternshipCards() {
  const cards = [];
  const elementsArr = $(".individual_internship");
  const headingHTML = getHeadingHTML();
  let index = 0;

  for (const element of elementsArr) {
    let percent = Math.floor((++index * 100) / elementsArr.length);

    await wait({ millseconds: 100 });
    const id = $(element).attr("internshipid");
    const detailsPageURL = $(element).find(".view_detail_button")[0].href;
    const properties = await getProperties(detailsPageURL);

    cards.push({ id, element, detailsPageURL, ...properties });
    showLoadingText(headingHTML, percent);
  }

  hideLoadingText(headingHTML);

  return cards;
}

export function addPropertiesToCard({ element, skills, noOfInternships }) {
  const detailsSection = $(element).find(".individual_internship_details")[0];
  const { innerHTML } = detailsSection;

  detailsSection.innerHTML = `<p>Skills Required: <span>${skills}</span></p>
    <p># of Internships available: <span>${noOfInternships}</span></p>
    ${innerHTML}`;
}

export function getHeadingHTML() {
  const heading = $("#internship_seo_heading_container h3");
  return heading.html();
}

export function showLoadingText(html, percent) {
  const heading = $("#internship_seo_heading_container h3");

  heading.html(
    `${html} <div
              style="text-align: center;
                      margin: 10px auto 0 auto;
                      font-size: 1.6rem;
                      color: #1295c9;"
              >
                Loading ${percent}%
              </div>`
  );
}
export function hideLoadingText(html) {
  const heading = $("#internship_seo_heading_container h3");

  heading.html(html);
}
