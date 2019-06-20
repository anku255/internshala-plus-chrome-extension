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

export async function getSkills(url) {
  try {
    const html = await fetchHTML(url);
    let re = /<span id="skillNames">(.*)<\/span>/i;
    if (re.exec(html)) {
      return re.exec(html)[1];
    }
    return "No skills found";
  } catch (err) {
    return "Failed to load";
  }
}

export async function getInternshipCards() {
  const cards = [];
  // TODO: Change afer DEV
  const elementsArr = $(".individual_internship").slice(1);
  const headingHTML = getHeadingHTML();
  let index = 0;

  for (const element of elementsArr) {
    let percent = Math.floor((++index * 100) / elementsArr.length);

    await wait({ millseconds: 100 });
    const id = $(element).attr("internshipid");
    const detailsPageURL = $(element).find(".view_detail_button")[0].href;
    const skills = await getSkills(detailsPageURL);

    cards.push({ id, element, detailsPageURL, skills });
    showLoadingText(headingHTML, percent);
  }

  hideLoadingText(headingHTML);

  return cards;
}

export function addSkillsToCard({ element, skills }) {
  const detailsSection = $(element).find(".individual_internship_details")[0];
  const { innerHTML } = detailsSection;

  detailsSection.innerHTML = `<p>Skills Required: <span>${skills}</span></p> ${innerHTML}`;
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
                Loading Skills ${percent}%
              </div>`
  );
}
export function hideLoadingText(html) {
  const heading = $("#internship_seo_heading_container h3");

  heading.html(html);
}
