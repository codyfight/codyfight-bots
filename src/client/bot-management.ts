let dropdownOptions: {
  gameModeOptions: { label: string; value: number }[];
  moveStrategyOptions: { label: string; value: string }[];
  castStrategyOptions: { label: string; value: string }[];
} = { gameModeOptions: [], moveStrategyOptions: [], castStrategyOptions: []};

async function fetchDropdownOptions(): Promise<void> {
  const response = await fetch("/dropdown-options");
  dropdownOptions = await response.json();
  populateDropdown("mode", dropdownOptions.gameModeOptions);
  populateDropdown("move_strategy", dropdownOptions.moveStrategyOptions);
  populateDropdown("cast_strategy", dropdownOptions.castStrategyOptions);
}

function populateDropdown(name: string, options: { label: string; value: number | string } [] ): void {
  const select = document.querySelector(`select[name="${name}"]`) as HTMLSelectElement;

  select.innerHTML = options
    .map((option) => `<option value="${option.value}">${option.label}</option>`)
    .join("");
}

async function fetchBots(): Promise<void> {
  const response = await fetch("/bots");
  const bots = await response.json();

  const table = document.querySelector("#botTable tbody") as HTMLTableSectionElement;
  table.innerHTML = "";

  bots.forEach((bot: any) => {
    const modeLabel = dropdownOptions.gameModeOptions.find((option) => option.value === bot.mode)?.label || bot.mode;
    const moveStrategyLabel = bot.move_strategy;
    const castStrategyLabel = bot.cast_strategy;

    const row = document.createElement("tr");

    row.innerHTML = `
    <td>${bot.ckey}</td>
    <td>${modeLabel}</td>
    <td>${bot.url}</td>
    <td>${bot.logging ? "Yes" : "No"}</td>
    <td>${moveStrategyLabel}</td>
    <td>${castStrategyLabel}</td>
    <td>
      <button class="btn btn-danger btn-sm" onclick="deleteBot('${bot.ckey}')">
          Delete
      </button>
    </td>`;

    table.appendChild(row);
  });
}

async function addBot(event: Event): Promise<void> {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  const data: any = Object.fromEntries(formData.entries());

  await fetch("/bots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  form.reset();
  await fetchBots();
}

async function deleteBot(ckey: string): Promise<void> {
  await fetch(`/bots/${ckey}`, { method: "DELETE" });
  await fetchBots();
}

window.onload = async (): Promise<void> => {
  await fetchDropdownOptions();
  await fetchBots();
};
