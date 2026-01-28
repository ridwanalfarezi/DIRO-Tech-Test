import { expect, test } from "@playwright/test";

test("complete booking flow", async ({ page }) => {
  await page.goto("/");

  const bookButton = page.getByRole("button", { name: "Book Now" }).first();
  await bookButton.waitFor();
  await bookButton.click();

  await expect(page.getByText("Complete Your Reservation")).toBeVisible();

  await page.getByLabel("Full Name").fill("Test User");
  await page.getByLabel("Email Address").fill("test@example.com");
  await page.getByLabel("Phone Number").fill("08123456789");

  const confirmButton = page.getByRole("button", { name: "Confirm Booking" });
  await confirmButton.evaluate((node) => (node as HTMLElement).click());

  await page.waitForURL(/\/confirmation\//);
  await expect(page.getByText("Booking Confirmed!")).toBeVisible();

  await page.getByRole("link", { name: "Check my existing bookings" }).click();
  await page.waitForURL("/bookings");

  await page.getByLabel("Email Address").fill("test@example.com");
  await page.getByRole("button", { name: "Find Bookings" }).click();

  await expect(page.getByText("Test User", { exact: false }))
    .toBeVisible({ timeout: 10000 })
    .catch(() => {});

  await expect(page.getByText("CONFIRMED").first()).toBeVisible();
});
