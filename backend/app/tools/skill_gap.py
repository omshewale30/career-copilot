import requests
import re
from langchain.tools import Tool

from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup


def extract_qualifications_from_text(text: str) -> list[str]:
    sections = re.split(r"\n+", text.lower())
    qualifications = []

    capture = False
    for line in sections:
        if any(keyword in line for keyword in ["qualifications", "requirements", "you should have", "we're looking for"]):
            capture = True
        elif capture and (line.strip() == "" or len(line.split()) < 3):
            break
        elif capture:
            qualifications.append(line.strip())

    return qualifications

def scrape_linkedin_qualifications(job_title="Data Scientist", limit=3):
    qualifications_all = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        search_url = f"https://www.linkedin.com/jobs/search/?keywords={job_title.replace(' ', '%20')}"
        page.goto(search_url)
        page.wait_for_timeout(5000)

        soup = BeautifulSoup(page.content(), "html.parser")
        job_cards = soup.find_all("span", class_="base-card__full-link")
        job_links = [a['href'] for a in job_cards][:limit]

        for link in job_links:
            page.goto(link)
            page.wait_for_timeout(3000)

            sub_soup = BeautifulSoup(page.content(), "html.parser")
            jd_div = sub_soup.find("div", class_="jobs-description__content jobs-description-content")
            
            if jd_div:
                text = jd_div.text.strip()
                q_section = extract_qualifications_from_text(text)
                qualifications_all.append("\n".join(q_section))

        browser.close()
    print(f"Extracted {len(qualifications_all)} qualifications from LinkedIn job postings.")
    print(qualifications_all)

    return qualifications_all



def extract_skills_from_descriptions(jobs):
    skills = []
    for job in jobs:
        desc = job.get("description", "").lower()
        skills += re.findall(r'\b[a-zA-Z]{2,}\b', desc)

    # Optional: filter common filler words
    stopwords = {"and", "the", "with", "for", "you", "are", "our", "will", "that", "work"}
    cleaned_skills = [word for word in skills if word not in stopwords and len(word) > 2]

    # Return top frequent ones
    from collections import Counter
    top_skills = Counter(cleaned_skills).most_common(15)
    return [skill for skill, _ in top_skills]


def get_top_skills_for_role(job_title: str):
    jobs = scrape_linkedin_qualifications(job_title)
    # skills = extract_skills_from_descriptions(jobs)
    # return skills



# Optional: wrap as a LangChain Tool
skill_scraper_tool = Tool(
    name="JobSkillScraper",
    func=get_top_skills_for_role,
    description="Extracts top required skills for a job title from real job listings"
)

# Example usage:
if __name__ == "__main__":
    job_title = "Software Engineer"
    scrape_linkedin_qualifications(job_title, limit=5)

    # skills = get_top_skills_for_role(job_title)
    # print(f"Top skills for {job_title}: {skills}")
