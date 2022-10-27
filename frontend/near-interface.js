/* Talking with a contract often involves transforming data, we recommend you to encapsulate that logic into a class */

export class PatientNEAR {
  constructor({ contractId, walletToUse }) {
    this.contractId = contractId;
    this.wallet = walletToUse;
  }

  async getPatients() {
    return await this.wallet.viewMethod({
      contractId: this.contractId,
      method: "get_patients",
    });
  }

  async createPatient(name, age, email, description) {
    return await this.wallet.callMethod({
      contractId: this.contractId,
      method: "create_patient",
      args: { name, age, email, description },
    });
  }
}
