/*
 * Example smart contract written in RUST
 *
 * Learn more about writing NEAR smart contracts with Rust:
 * https://near-docs.io/develop/Contract
 *
 */

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, near_bindgen};

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Patient {
    pub id: u64,
    pub created_by: String,
    pub name: String,
    pub age: String,
    pub email: String,
    pub description: String,
}

impl Default for Patient {
    fn default() -> Self {
        Patient {
            id: 0,
            created_by: String::from(""),
            name: String::from(""),
            age: String::from(""),
            email: String::from(""),
            description: String::from(""),
        }
    }
}

impl Patient {
    pub fn new(name: String, age: String, email: String, description: String) -> Self {
        Self {
            id: env::block_index(),
            created_by: env::signer_account_id().to_string(),
            name,
            age,
            email,
            description,
        }
    }
}

// Define the contract structure
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    patients: UnorderedMap<u64, Patient>,
}

// Define the default, which automatically initializes the contract
impl Default for Contract {
    fn default() -> Self {
        Self {
            patients: UnorderedMap::new(b"e".to_vec()),
        }
    }
}

// Implement the contract structure
#[near_bindgen]
impl Contract {
    // Public method - returns the patient saved
    pub fn get_patient(&self, id: u64) -> Option<Patient> {
        self.patients.get(&id)
    }

    pub fn get_patients(&self) -> Vec<(u64, Patient)> {
        self.patients.to_vec()
    }

    // Public method - accepts a patient info
    pub fn create_patient(
        &mut self,
        name: String,
        age: String,
        email: String,
        description: String,
    ) {

        let patient = Patient::new(
            String::from(&name),
            String::from(&age),
            String::from(&email),
            String::from(&description),
        );

        //Lo guardamos en la coleccion de patients
        self.patients.insert(&patient.id, &patient);

        //Manda un mensaje a la terminal al ejecutar el método
        env::log(
            format!(
                "Nuevo patient añadido con éxito. Id Patient: {}",
                &patient.id
            )
            .as_bytes(),
        )
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
        // this test did not call create_patient so should return the default "Username" patient
        assert_eq!(contract.get_patient().name, "Username".to_string());
    }
}
