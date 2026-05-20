use anyhow::Result;
use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(name = "curatist")]
#[command(version, about = "Personal assistant CLI — powered by Asurada")]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// 이메일 관리
    Mail,
    /// 일정 관리
    Cal,
    /// 소비 습관 관리
    Spend,
}

fn main() -> Result<()> {
    let cli = Cli::parse();
    match cli.command {
        Commands::Mail => println!("mail — WIP"),
        Commands::Cal => println!("cal — WIP"),
        Commands::Spend => println!("spend — WIP"),
    }
    Ok(())
}
