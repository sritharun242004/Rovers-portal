# Sport-Based Pricing Update

## Overview
The registration system has been updated from **country-based pricing** to **sport-specific pricing**. Each sport now has its own registration fee per student in Malaysian Ringgit (MYR).

---

## 📊 Updated Pricing Table

| Sport | Registration Fee (per student) |
|-------|-------------------------------|
| **Skating** | RM 100.00 |
| **Badminton** | RM 100.00 |
| **Taekwondo** | RM 100.00 |
| **Karate** | RM 150.00 |
| **Silambam** | RM 100.00 |
| **Athletics** | RM 30.00 |
| **Football** | RM 300.00 |
| **Cricket** | RM 300.00 |

**All prices are in Malaysian Ringgit (MYR)** and stored in the database as cents (e.g., 10000 cents = RM 100.00).

---

## 🔧 Changes Made

### 1. **Database Schema Update**
   - **File:** `jilani_server/models/Sport.js`
   - **Change:** Added `registrationFee` field (Number, default: 0)
   - **Storage:** Fees are stored in cents to avoid decimal precision issues

### 2. **Database Pricing Update**
   - **Script:** `jilani_server/scripts/updateSportPricing.js`
   - **Status:** ✅ Successfully updated 8 sports in the database
   - **Usage:** Run `node scripts/updateSportPricing.js` to update pricing

### 3. **Backend Service Updates**
   - **File:** `jilani_server/services/paymentService.js`
   - **New Methods:**
     - `calculateAmountBySport(sportId, studentCount)` - Calculate sport-based pricing
     - `getSportPricing(sportId)` - Get pricing for a specific sport
   - **Backward Compatibility:** Country-based pricing methods still work for legacy support

### 4. **Backend API Routes**
   - **File:** `jilani_server/routes/paymentRoutes.js`
   - **Updated Route:** `POST /api/payment/calculate`
     - Now accepts `sportId` parameter for sport-based pricing
     - Falls back to `country` parameter for country-based pricing (legacy)
   - **New Route:** `GET /api/payment/sport/:sportId/pricing`
     - Returns pricing information for a specific sport

### 5. **Frontend API Client**
   - **File:** `jilani_cleint/src/api/payment.ts`
   - **New Functions:**
     - `calculatePricingBySport(sportId, studentCount)` - Calculate sport pricing
     - `getSportPricing(sportId)` - Fetch sport pricing info
   - **Updated Function:**
     - `calculatePricing()` - Now supports optional `sportId` parameter

### 6. **Frontend Payment Modal**
   - **File:** `jilani_cleint/src/components/RegistrationPaymentModal.tsx`
   - **Change:** Updated to fetch sport-based pricing using `sportId`
   - **Fallback:** Uses country-based pricing if `sportId` is not provided

---

## 🔄 How It Works

### Frontend Flow:
1. User selects students for registration
2. Clicks "Register X Students" button
3. `RegistrationPaymentModal` opens
4. Modal fetches pricing using `sportId`
5. Displays total amount based on sport and student count
6. User uploads payment screenshot
7. Registration is processed with payment proof

### Backend Flow:
1. API receives `/api/payment/calculate` request with `sportId`
2. `PaymentService.calculateAmountBySport()` is called
3. Fetches sport from database using Sport model
4. Calculates: `totalAmount = sport.registrationFee × studentCount`
5. Returns calculation with sport name, currency (MYR), and breakdown

---

## 🧪 Testing

### Test the Pricing Display:
1. Navigate to student selection page: `/event/:eventId/student-selection?sportId=...`
2. Select one or more students
3. Click "Register X Students" button
4. **Expected Result:** Payment modal shows correct pricing for the selected sport

### Verify Pricing Calculation:
```bash
# Example for Cricket (RM 300 per student)
# 3 students = RM 900.00

curl -X POST http://localhost:3000/api/payment/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "sportId": "SPORT_ID_HERE",
    "studentCount": 3
  }'
```

### API Test Examples:

#### Get Sport Pricing:
```bash
GET /api/payment/sport/:sportId/pricing
```

**Response:**
```json
{
  "success": true,
  "pricing": {
    "sportId": "691acec1d3fe0b5a2fbb1d61",
    "sportName": "Athletics",
    "currency": "myr",
    "registrationFee": 3000,
    "registrationFeeDisplay": "RM 30.00"
  }
}
```

#### Calculate Total for Multiple Students:
```bash
POST /api/payment/calculate
{
  "sportId": "691acec1d3fe0b5a2fbb1d61",
  "studentCount": 5
}
```

**Response:**
```json
{
  "success": true,
  "calculation": {
    "sportId": "691acec1d3fe0b5a2fbb1d61",
    "sportName": "Athletics",
    "currency": "myr",
    "studentCount": 5,
    "registrationFee": 3000,
    "totalAmount": 15000,
    "breakdown": {
      "registration": {
        "perStudent": 3000,
        "total": 15000,
        "description": "Athletics registration fee (5 students)"
      }
    }
  }
}
```

---

## 🗂️ Database Storage

### Sport Collection Example:
```javascript
{
  "_id": "691acec1d3fe0b5a2fbb1d61",
  "name": "Athletics",
  "registrationFee": 3000,  // Stored in cents (RM 30.00)
  "description": "Track and field events",
  // ... other fields
}
```

### Registration Collection:
```javascript
{
  "_id": "...",
  "student": "...",
  "sport": "691acec1d3fe0b5a2fbb1d61",
  "paymentAmount": 15000,  // Total in cents (5 students × RM 30)
  "paymentCurrency": "myr",
  "paymentScreenshot": "https://s3.../payment-screenshots/...",
  "paymentStatus": "paid",
  // ... other fields
}
```

---

## 📝 Important Notes

1. **All fees are in Malaysian Ringgit (MYR)** - no multi-currency support needed
2. **Stored in cents** - multiply by 100 when saving, divide by 100 when displaying
3. **Backward compatible** - country-based pricing still works for legacy requests
4. **Database updated** - all 8 sports now have correct pricing
5. **S3 folders:**
   - Student photos: `student-photos/`
   - Payment screenshots: `payment-screenshots/`

---

## 🚀 How to Update Pricing in the Future

If you need to change sport pricing:

1. **Edit the pricing in the script:**
   ```javascript
   // File: jilani_server/scripts/updateSportPricing.js
   const SPORT_PRICING = {
     'Football': 35000,  // Change from RM 300 to RM 350
     // ... other sports
   };
   ```

2. **Run the update script:**
   ```bash
   cd jilani_server
   node scripts/updateSportPricing.js
   ```

3. **Or update directly via MongoDB:**
   ```javascript
   db.sports.updateOne(
     { name: "Football" },
     { $set: { registrationFee: 35000 } }  // RM 350 in cents
   )
   ```

---

## ✅ Verification Checklist

- [x] Sport model updated with `registrationFee` field
- [x] Database updated with pricing for all 8 sports
- [x] Backend service supports sport-based pricing
- [x] API routes handle sport-based pricing requests
- [x] Frontend fetches and displays sport-specific pricing
- [x] Payment modal calculates correct totals
- [x] Backward compatible with country-based pricing

---

## 📞 Support

If you encounter any issues:
1. Check console logs for API responses
2. Verify `sportId` is being passed correctly
3. Confirm database connection is active
4. Ensure all sports have `registrationFee` field populated

---

**Last Updated:** November 18, 2024  
**Status:** ✅ Successfully Deployed





