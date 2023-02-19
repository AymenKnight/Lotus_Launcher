#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::fs;
use std::sync::Mutex;

use local_ip_address::local_ip;
use sysinfo::{ProcessExt, System, SystemExt};
use tauri::{
    api::dialog::{ask, MessageDialogBuilder, MessageDialogButtons},
    CustomMenuItem, Manager, State, SystemTray, SystemTrayEvent, SystemTrayMenu,
};

struct ServerState(Mutex<String>);

#[tauri::command]
fn kill_api() -> String {
    let mut found = false;
    let binding = System::new_all();
    for process in binding.processes_by_name("Lotus-Win64.exe") {
        process
            .kill()
            .then(|| println!("Killed process {}", process.name()))
            .expect("Failed to kill process ");
        found = true;
    }

    if found == false {
        format!("API is not running or already closed")
    } else {
        format!("API closed successfully")
    }
}
#[tauri::command]
fn is_api_running() -> String {
    let mut found = false;
    let binding = System::new_all();
    for _process in binding.processes_by_name("Lotus-Win64.exe") {
        found = true;
        break;
    }

    if found == false {
        format!("false")
    } else {
        format!("true")
    }
}

#[tauri::command]
fn get_ip() -> String {
    let my_local_ip = local_ip().unwrap(); //TODO: handle error if no ip found
    format!("{:?}", my_local_ip)
}
#[tauri::command]
fn is_bd_initialized(handle: tauri::AppHandle) -> String {
    let resource_path = handle
        .path_resolver()
        .resolve_resource("Binaries/ThirdParty/PostgreSQL/data/")
        .expect("failed to resolve resource");
    let is_exist = resource_path.exists();
    if !is_exist {
        fs::create_dir(resource_path).expect("failed to create directory");
    }
    format!("{:?}", is_exist)
}

#[tauri::command]
fn set_server_state(state: String, old_state: State<ServerState>) -> String {
    let mut server_state = old_state.0.lock().unwrap();
    *server_state = state;
    format!("{}", *server_state)
}

fn main() {
    let app_name = "Clinicord Server";

    let quit = CustomMenuItem::new("quit".to_string(), format!("Quit {}", app_name));
    let tray_menu = SystemTrayMenu::new().add_item(quit);
    tauri::Builder::default()
        .manage(ServerState(Default::default()))
        .on_window_event(move |event| match event.event() {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                let window = event.window();
                let state = window.state::<ServerState>().0.lock().unwrap().to_string();
                api.prevent_close();
                if state != "started" {
                    //get app name
                    ask(
                        Some(&window),
                        format!("Close {}", app_name),
                        format!("Are you sure you want to close {}?", app_name),
                        move |answer| {
                            if answer {
                                std::process::exit(0);
                            }
                        },
                    );
                } else {
                    event.window().hide().unwrap();
                }
            }

            _ => {}
        })
        .system_tray(SystemTray::new().with_menu(tray_menu))
        .on_system_tray_event(move |app, event| match event {
            SystemTrayEvent::DoubleClick {
                position: _,
                size: _,
                ..
            } => {
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
                window.set_focus().unwrap();
            }
            SystemTrayEvent::MenuItemClick { id, .. } => {
                let window = app.get_window("main").unwrap();
                //get state
                let state = app.state::<ServerState>().0.lock().unwrap().to_string();

                match id.as_str() {
                    "quit" => {
                        if state == "started" {
                            MessageDialogBuilder::new(
                                "The server is running",
                                format!("You can't close {} while the server is running", app_name),
                            )
                            .buttons(MessageDialogButtons::Ok)
                            .parent(&window)
                            .kind(tauri::api::dialog::MessageDialogKind::Warning)
                            .show(move |_| {
                                window.show().unwrap();
                                window.set_focus().unwrap();
                            });

                            //emit event
                        } else {
                            ask(
                                Some(&window),
                                format!("Close {}", app_name),
                                format!("Are you sure you want to close {}?", app_name),
                                move |answer| {
                                    if answer {
                                        std::process::exit(0);
                                    }
                                },
                            );
                        }
                    }

                    _ => {}
                }
            }
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![
            kill_api,
            is_api_running,
            get_ip,
            is_bd_initialized,
            set_server_state
        ])
        .run(tauri::generate_context!())
        .expect(format!("{} failed to run", app_name).as_str());
}
