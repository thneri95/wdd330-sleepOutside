export default class Alert {
  constructor(alertPath, mainElement) {
    this.alertPath = alertPath;
    this.mainElement = mainElement;
  }

  async init() {
    const alerts = await this.getAlerts();
    this.renderAlerts(alerts);
  }

  async getAlerts() {
    try {
      const response = await fetch(this.alertPath);
      if (!response.ok) {
        throw new Error("Failed to load alerts");
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  }

  renderAlerts(alerts) {
    if (!this.mainElement || !alerts.length) {
      return;
    }

    const existingList = this.mainElement.querySelector(".alert-list");
    if (existingList) {
      existingList.remove();
    }

    const alertList = document.createElement("section");
    alertList.className = "alert-list";

    alerts.forEach((alertItem) => {
      if (!alertItem?.message) {
        return;
      }

      const messageElement = document.createElement("p");
      messageElement.textContent = alertItem.message;

      if (alertItem.background) {
        messageElement.style.backgroundColor = alertItem.background;
      }

      if (alertItem.color) {
        messageElement.style.color = alertItem.color;
      }

      alertList.appendChild(messageElement);
    });

    if (alertList.children.length) {
      this.mainElement.prepend(alertList);
    }
  }
}
