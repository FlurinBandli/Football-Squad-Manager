# Test Plan for Football Squad Manager Basic Operations

## Application Overview

The Football Squad Manager is a web application for managing football squads, players, and trainers. It features an admin interface for CRUD operations on squads, players, and trainers, including squad lineup building. Public users can view squad lineups. The app uses authentication for admin access.

## Test Scenarios

### 1. Authentication

**Seed:** `tests/seed.spec.ts`

#### 1.1. Successful Admin Login

**File:** `tests/login.spec.ts`

**Steps:**

1. Navigate to http://localhost:3000/login
   - expect: The login page loads with username and password fields

2. Enter 'vcg8guqi' in the username field
   - expect: Username field is filled

3. Enter 'CFQ9NVYlHiPYgj' in the password field
   - expect: Password field is filled

4. Click the Login button
   - expect: Redirected to /admin/squads with squads list displayed

#### 1.2. Invalid Login Attempt

**File:** `tests/login-invalid.spec.ts`

**Steps:**

1. Navigate to http://localhost:3000/login
   - expect: The login page loads

2. Enter 'invalid' in the username field
   - expect: Username field is filled

3. Enter 'wrong' in the password field
   - expect: Password field is filled

4. Click the Login button
   - expect: Error message displayed, not redirected

### 2. Squad Management

**Seed:** `tests/seed.spec.ts`

#### 2.1. View Squads List

**File:** `tests/admin-squads/view-squads.spec.ts`

**Steps:**

1. Navigate to /admin/squads
   - expect: Table displays list of squads with columns: Id, Name, Description, Date, Actions

2. Verify squads are present in the table
   - expect: At least one squad is listed

#### 2.2. Search Squads

**File:** `tests/admin-squads/search-squads.spec.ts`

**Steps:**

1. Navigate to /admin/squads
   - expect: Search box is present

2. Type 'Feuer' in the search box
   - expect: Table shows only squads matching the search term

#### 2.3. Paginate Squads

**File:** `tests/admin-squads/paginate-squads.spec.ts`

**Steps:**

1. Navigate to /admin/squads
   - expect: Pagination controls are visible

2. Click the 'Next' pagination button
   - expect: Page 2 loads with different squads

#### 2.4. View Public Squad Lineup

**File:** `tests/admin-squads/view-public-squad.spec.ts`

**Steps:**

1. Navigate to /admin/squads
   - expect: On squads list

2. Click the view icon for the first squad
   - expect: Navigated to public squad page with lineup displayed

#### 2.5. Edit Squad

**File:** `tests/admin-squads/edit-squad.spec.ts`

**Steps:**

1. Navigate to /admin/squads
   - expect: On squads list

2. Click the edit icon for the first squad
   - expect: Edit form loads with current squad data

3. Change the team name to 'Edited Squad'
   - expect: Name field updated

4. Click 'Team aktualisieren'
   - expect: Redirected to squads list with updated name

#### 2.6. Create New Squad

**File:** `tests/admin-squads/create-squad.spec.ts`

**Steps:**

1. Navigate to /admin/squads
   - expect: On squads list

2. Click 'Neues Team erstellen'
   - expect: New squad form loads

3. Fill team name 'New Squad', description 'Test squad', date '01.01.2025'
   - expect: Form fields filled

4. Click 'Team erstellen'
   - expect: Redirected to squads list with new squad added

#### 2.7. Delete Squad

**File:** `tests/admin-squads/delete-squad.spec.ts`

**Steps:**

1. Navigate to /admin/squads
   - expect: On squads list

2. Click the delete icon for a squad
   - expect: Confirmation dialog appears

3. Confirm deletion in the dialog
   - expect: Squad removed from list

### 3. Player Management

**Seed:** `tests/seed.spec.ts`

#### 3.1. View Players List

**File:** `tests/admin-players/view-players.spec.ts`

**Steps:**

1. Navigate to /admin/players
   - expect: Table displays list of players

2. Verify players are present
   - expect: Players listed with first name, last name, gender, actions

#### 3.2. Create New Player

**File:** `tests/admin-players/create-player.spec.ts`

**Steps:**

1. Navigate to /admin/players
   - expect: On players list

2. Click 'Neuen Spieler erstellen'
   - expect: A sheet/dialog titled 'Spieler erstellen' opens on the same page

3. Fill first name 'John', last name 'Doe', gender 'Male'
   - expect: Form filled

4. Click 'Spieler erstellen'
   - expect: Redirected to players list with new player

### 4. Trainer Management

**Seed:** `tests/seed.spec.ts`

#### 4.1. View Trainers List

**File:** `tests/admin-trainers/view-trainers.spec.ts`

**Steps:**

1. Navigate to /admin/trainers
   - expect: Table displays list of trainers

2. Verify trainers are present
   - expect: Trainers listed

### 5. General

**Seed:** `tests/seed.spec.ts`

#### 5.1. Logout

**File:** `tests/logout.spec.ts`

**Steps:**

1. Navigate to /admin/squads
   - expect: On admin page

2. Click the Logout button
   - expect: Redirected to login page
