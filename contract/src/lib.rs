/*
 * Example smart contract written in RUST
 *
 * Learn more about writing NEAR smart contracts with Rust:
 * https://near-docs.io/develop/Contract
 *
 */

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{log, near_bindgen};

// Define the default message
const DEFAULT_USERNAME: &str = "Username";
const DEFAULT_AGE: &str = "0";
const DEFAULT_EMAIL: &str = "Email";
const DEFAULT_DESCRIPTION: &str = "Description";

// Define the contract structure
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    patient: Patient,
}

#[derive(BorshDeserialize, BorshSerialize, serde::Serialize)]
pub struct Patient {
    name: String,
    age: String,
    email: String,
    description: String,
}

// Define the default, which automatically initializes the contract
impl Default for Contract{
    fn default() -> Self{
        Self{patient : Patient { name : DEFAULT_USERNAME.to_string(),
            age : DEFAULT_AGE.to_string(),
            email : DEFAULT_EMAIL.to_string(),
            description : DEFAULT_DESCRIPTION.to_string()}}
    }
}

// Implement the contract structure
#[near_bindgen]
impl Contract {
    // Public method - returns the patient saved
    pub fn get_patient(&self) -> Patient {
        let patient = Patient { name : DEFAULT_USERNAME.to_string(),
            age : DEFAULT_AGE.to_string(),
            email : DEFAULT_EMAIL.to_string(),
            description : DEFAULT_DESCRIPTION.to_string()};
        return patient;
    }

    // Public method - accepts a patient info
    pub fn set_patient(&mut self, name: String, age: String, email: String, description: String) {
        // Use env::log to record logs permanently to the blockchain!
        log!("Saving patient {}", name);
        self.patient.name = name;
        self.patient.age = age;
        self.patient.email = email;
        self.patient.description = description;
    }
}

/*
 * The rest of this file holds the inline tests for the code above
 * Learn more about Rust tests: https://doc.rust-lang.org/book/ch11-01-writing-tests.html
 */
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn get_default_patient() {
        let contract = Contract::default();
        // this test did not call set_patient so should return the default "Username" patient
        assert_eq!(
            contract.get_patient().name,
            "Username".to_string()
        );
    }

}
