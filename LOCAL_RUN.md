# How to Run Moltbook GUI on Windows

This guide assumes you are completely new to this. Don't worry, it's easy!

## The "One-Click" Method (Recommended)

1.  Open the folder `Documents\Moltbook GUI`.
2.  Look for a file named **`start_app.cmd`** (it might just say `start_app` with a gear icon).
3.  **Double-click it**.

**What will happen:**
*   A black window (Terminal) will pop up.
*   You will see text scrolling and a loading bar (this is it downloading the "brain" of the app).
*   **Wait** until it stops scrolling.
*   It should automatically open your web browser to the app.
*   If it doesn't open automatically, look for a link in the black window that says `http://localhost:5173` and Ctrl+Click it.

---

## Troubleshooting (If that didn't work)

If the black window closes immediately or gives an error:

1.  **Right-click** an empty space in the `Moltbook GUI` folder.
2.  Select **"Open in Terminal"**.
3.  Type this exact command and press Enter:
    ```powershell
    npm install
    ```
4.  Wait for it to finish.
5.  Then type this command and press Enter:
    ```powershell
    npm run dev
    ```
6.  You should see green text saying `Local: http://localhost:5173`. Open that link in Chrome/Edge.

---

## Notes
*   **Keep the black window open!** That is the server running. If you close it, the site stops working.
*   To stop the app, click in the black window and press `Ctrl + C`, then type `Y` and Enter.

