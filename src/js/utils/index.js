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
  const elementsArr = $(".individual_internship").slice(1, 5);

  for (const element of elementsArr) {
    await wait({ millseconds: 100 });
    const id = $(element).attr("internshipid");
    const detailsPageURL = $(element).find(".view_detail_button")[0].href;
    const skills = await getSkills(detailsPageURL);

    cards.push({ id, element, detailsPageURL, skills });
  }

  return cards;
}

export function addSkillsToCard({ element, skills }) {
  const detailsSection = $(element).find(".individual_internship_details")[0];
  const { innerHTML } = detailsSection;

  detailsSection.innerHTML = `<p>Skills Required: <span>${skills}</span></p> ${innerHTML}`;
}
