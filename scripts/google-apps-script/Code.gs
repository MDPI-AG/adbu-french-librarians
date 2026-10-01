/**
 * Google Apps Script bound to the newsletter spreadsheet.
 *
 * Setup:
 * 1. Open the sheet → Extensions → Apps Script
 * 2. Paste this file as Code.gs
 * 3. Project Settings → Script properties → add SIGNUP_SECRET
 * 4. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the web app URL into Netlify env GOOGLE_SCRIPT_URL
 *    (same SIGNUP_SECRET value in Netlify)
 */
function doPost(e) {
  var result = handlePost_(e);
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ ok: false, error: "Use POST." })
  ).setMimeType(ContentService.MimeType.JSON);
}

function handlePost_(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return { ok: false, error: "Empty body." };
    }

    var payload = JSON.parse(e.postData.contents);
    var expected = PropertiesService.getScriptProperties().getProperty(
      "SIGNUP_SECRET"
    );

    if (!expected || payload.secret !== expected) {
      return { ok: false, error: "Unauthorized." };
    }

    var title = String(payload.title || "").trim();
    var firstname = String(payload.firstname || "").trim();
    var lastname = String(payload.lastname || "").trim();
    var email = String(payload.email || "").trim();

    if (!title || !firstname || !lastname || !email) {
      return { ok: false, error: "Missing fields." };
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    sheet.appendRow([title, firstname, lastname, email]);

    return { ok: true };
  } catch (error) {
    return { ok: false, error: String(error) };
  }
}
