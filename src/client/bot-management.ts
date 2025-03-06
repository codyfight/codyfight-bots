interface Bot {
  ckey: string;
  mode: number;
  environment: string;
  move_strategy: string;
  cast_strategy: string;
}

interface Option {
  label: string;
  value: number | string;
}

interface DropdownOptions {
  gameModeOptions: Option[];
  moveStrategyOptions: Option[];
  castStrategyOptions: Option[];
}

let dropdownOptions: DropdownOptions = {
  gameModeOptions: [],
  moveStrategyOptions: [],
  castStrategyOptions: []
};

/**
 * Main initializer (called on window.onload).
 */
async function init(): Promise<void> {
  await fetchDropdownOptions();
  await fetchBots();
  checkDeveloperOptions();
}

/**
 * Checks if the URL contains ?user=dev and removes hidden .developer-option class.
 */
function checkDeveloperOptions(): void {
  const urlParams = new URLSearchParams(window.location.search);
  const user = urlParams.get('user');

  if (user === 'dev') {
    const devElements = document.querySelectorAll('.developer-option');
    devElements.forEach((el) => {
      el.classList.remove('developer-option');
    });
  }
}


/**
 * Fetches the dropdown options from the server and populates the select elements.
 */
async function fetchDropdownOptions(): Promise<void> {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get('user') || '';

    // Pass the user as a query param
    const response = await fetch(`/bots/options?user=${user}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch dropdown options: ${response.statusText}`);
    }

    dropdownOptions = await response.json();

    populateDropdown('mode', dropdownOptions.gameModeOptions);
    populateDropdown('move_strategy', dropdownOptions.moveStrategyOptions);
    populateDropdown('cast_strategy', dropdownOptions.castStrategyOptions);
  } catch (error) {
    console.error('Error fetching dropdown options:', error);
  }
}


/**
 * Populates a <select> element with the provided options.
 */
function populateDropdown(selectName: string, options: Option[]): void {
  const select = document.querySelector(`select[name="${selectName}"]`) as HTMLSelectElement;

  if (!select) return;

  select.innerHTML = options
    .map((option) => `<option value="${option.value}">${option.label}</option>`)
    .join('');
}

/**
 * Fetches the list of bots and populates the table.
 */
async function fetchBots(): Promise<void> {
  try {
    const response = await fetch('/bots?player_id=1');
    if (!response.ok) {
      throw new Error(`Failed to fetch bots: ${response.statusText}`);
    }

    const data = await response.json();
    const bots: Bot[] = data.bots;

    populateBotTable(bots);
  } catch (error) {
    console.error('Error fetching bots:', error);
  }
}

/**
 * Fills the #botTable <tbody> with rows based on the bots array.
 */
function populateBotTable(bots: Bot[]): void {
  const tableBody = document.querySelector('#botTable tbody') as HTMLTableSectionElement;
  if (!tableBody) return;

  tableBody.innerHTML = '';

  bots.forEach((bot) => {
    const modeLabel =
      dropdownOptions.gameModeOptions.find((opt) => opt.value === bot.mode)?.label || bot.mode;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${bot.ckey}</td>
      <td>${modeLabel}</td>
      <td>${bot.move_strategy}</td>
      <td>${bot.cast_strategy}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="deleteBot('${bot.ckey}')">
          Delete
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

/**
 * Handles the Add Bot form submission, sends a POST to add a new bot,
 * and then refreshes the bot list.
 */
async function addBot(event: Event): Promise<void> {
  event.preventDefault();

  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);

  // Convert FormData to a plain JS object
  const data: Record<string, any> = Object.fromEntries(formData.entries());
  data.player_id = 1;

  try {
    await fetch('/bot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    form.reset();
    await fetchBots();
  } catch (error) {
    console.error('Error adding bot:', error);
  }
}

/**
 * Sends a DELETE request to remove a bot with the given ckey
 */
async function deleteBot(ckey: string): Promise<void> {
  try {
    await fetch(`/bot/${ckey}`, { method: 'DELETE' });
    await fetchBots();
  } catch (error) {
    console.error('Error deleting bot:', error);
  }
}

window.onload = init;
