#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use sysinfo::{ProcessExt, System, SystemExt};
use tauri::{Manager, WindowEvent};
use local_ip_address::local_ip;
#[tauri::command]
fn kill_api() -> String {
    let mut found=false;
    let binding = System::new_all();
for process in binding.processes_by_name("exec.mc"){
process.kill().then(|| println!("Killed process {}", process.name())).expect("Failed to kill process ");
found=true;
}

if found==false{
    format!("API is not running or already closed")
}
else{
    format!("API closed successfully")}
}
#[tauri::command]
fn is_api_running() -> String {
    let mut found=false;
    let binding = System::new_all();
for _process in binding.processes_by_name("exec.mc"){
found=true;
break;
}

if found==false{
    format!("false")
}
else{
    format!("true")}
}


#[tauri::command]
fn get_ip() -> String {
    let my_local_ip = local_ip().unwrap();
    format!("{:?}", my_local_ip)
}
// #[tauri::command]
// fn init_process( window: Window) {
//     // let command :StdCommand= StdCommand::from(
//     //     Command::new_sidecar("start")
//     //         .expect("Failed to start api"),
//     //     );command.spawn().expect("Failed to spawn `backend_server` binary");
//     //     command.stdin()
// //   std::thread::spawn(move || {
// //    let c= Command::new("start");
// //  let child=  c.spawn();
// //  child.unwrap().0.
// //   });
// }

fn main() {

    tauri::Builder::default().setup(
        |app| {
            let main_window = app.get_window("main").unwrap();

            Ok(())}
    
        ) .on_window_event(move |event| match event.event() {
            WindowEvent::Destroyed =>  {
              println!("Window destroyed");
              kill_api();
            }
        
            _ => {}
          })
        .invoke_handler(tauri::generate_handler![kill_api,is_api_running,get_ip])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
