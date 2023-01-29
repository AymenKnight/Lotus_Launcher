#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{Manager};
use std::{process::Command, fs, path::Path};
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
// #[tauri::command]
// fn start_the_server(handle: tauri::AppHandle) -> String {
//    let resource_path = handle.path_resolver()
//       .resolve_resource("latus.exe")
//       .expect("failed to resolve resource");
      
//     let file = std::fs::File::open(&resource_path).unwrap();

// // let output = Command::new("$RESOURCE/latus.exe").output().expect("Failed to execute process");
// // let stdout = String::from_utf8_lossy(&output.stdout);
// // let stderr = String::from_utf8_lossy(&output.stderr);
// //  let mut vec = Vec::new();
// //   vec.push(stdout.to_string());
// // vec.push(stderr.to_string());

// //     return vec;
// }



fn main() {
   
    tauri::Builder::default().setup(
        |app| {
            let win = app.get_window("main").unwrap();
           
            win.unminimize();
          
            win.set_resizable(false);

            Ok(())}
    )
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
