# S² Bites — Cloud Food Ordering

A complete Firebase-backed food ordering site: customer login/register,
a menu with cart, cash/bank-transfer checkout with receipt upload, and
a real-time admin dashboard.

## Files

| File | Purpose |
|---|---|
| `index.html` | Login / register screen |
| `home.html` | Menu, cart, checkout, thank-you screen |
| `admin.html` | Real-time order dashboard (admin only) |
| `style.css` | All styling for every page |
| `firebase.js` | Firebase app/auth/firestore/storage init |
| `auth.js` | Login + register logic, routes by email |
| `app.js` | Menu rendering, cart, checkout, order submission |
| `admin.js` | Live order feed, status updates, delete |
| `images/` | Add your own food photos here (see `images/README.txt`) |

## Running it

1. Add real food photos into `images/` using the exact filenames listed
   in `images/README.txt` (the site works without them too — cards just
   show a plain placeholder).
2. Open `index.html` in a browser, or serve the folder with any static
   file server (e.g. `npx serve .`). Firebase Auth needs `http://` or
   `https://`, not `file://`, to work reliably in most browsers.
3. Create the admin account once, either in the Firebase console or by
   registering through the site with the email `admin@squarebites.com`.
   Any other email registered through the site becomes a regular
   customer.

## Firebase project setup (square-bites)

In the Firebase console for this project:

1. **Authentication → Sign-in method** → enable **Email/Password**.
2. **Firestore Database** → create the database (production mode is fine).
3. **Storage** → make sure the default bucket is enabled.

### Suggested Firestore rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /orders/{orderId} {
      allow create: if request.auth != null;
      allow read, update, delete: if request.auth != null &&
        (request.auth.token.email == "admin@squarebites.com" ||
         resource.data.userEmail == request.auth.token.email);
    }
  }
}
```

### Suggested Storage rules

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /receipts/{userId}/{fileName} {
      allow write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null;
    }
  }
}
```

These rules let signed-in customers create orders and upload their own
receipts, while only the admin account can read/update/delete every
order (customers can still read their own).

## Notes

- `admin@squarebites.com` is hard-coded in `firebase.js` as `ADMIN_EMAIL`
  and checked on both the client (`admin.js`) and should also be
  enforced server-side via the Firestore rules above — client-side
  checks alone are not real security.
- Order status flows through three states: `Pending → Preparing →
  Delivered`, editable any time from the dashboard, plus delete.
