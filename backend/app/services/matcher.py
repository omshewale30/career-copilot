from sklearn.feature_extraction.text import TfidfVectorizer
import re, string, json







def clean(text: str) -> str:
    text = re.sub(r"[{}]".format(string.punctuation), " ", text)
    return re.sub(r"\s+", " ", text.lower()).strip()

SEC_HEADERS = {
    "work_experience":   re.compile(r"^(work|professional).*experience", re.I),
    "education":         re.compile(r"^education", re.I),
    "projects":          re.compile(r"^projects?", re.I),
    "skills":            re.compile(r"^skills?", re.I),
    "certificates":      re.compile(r"^(certifications?|licenses?)", re.I),
    "summary":           re.compile(r"^(summary|profile)", re.I),
}

def sectionize(lines):
    current, buff, sections = None, [], {}
    for line in lines:
        stripped = line.strip()
        if not stripped: continue                           # skip blanks
        hit = next((k for k,rx in SEC_HEADERS.items() if rx.match(stripped)), None)
        if hit:
            if current: sections[current] = buff
            current, buff = hit, []
        else:
            buff.append(stripped)
    if current: sections[current] = buff
    return sections            # { "work_experience": [ ... ], ... }

