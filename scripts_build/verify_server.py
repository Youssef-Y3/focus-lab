import urllib.request
import re

try:
    res = urllib.request.urlopen('http://localhost:8080/')
    html = res.read().decode('utf-8')
    print("HTTP 200 OK - length:", len(html))
    
    assert 'data-page="student"' in html, "Student button not in nav"
    assert 'id="page-student"' in html, "page-student not in HTML"
    assert 'assets/modern.css' in html, "modern.css not linked"
    assert 'assets/student-hub.js' in html, "student-hub.js not linked"
    assert 'headerAudioBtn' in html, "headerAudioBtn not in HTML"
    assert 'headerSosBtn' in html, "headerSosBtn not in HTML"
    
    print("All HTML component checks passed successfully!")
except Exception as e:
    print("Error:", e)
