mod commands;
mod paths;
mod worker;

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
    /// 이메일 트래킹 (답장 필요한 메일 관리)
    Mail {
        #[command(subcommand)]
        cmd: commands::mail::MailCmd,
    },
    /// 개인 일정 관리
    Cal {
        #[command(subcommand)]
        cmd: commands::cal::CalCmd,
    },
    /// 소비 기록 및 분석
    Spend {
        #[command(subcommand)]
        cmd: commands::spend::SpendCmd,
    },
    /// Supabase 테이블 초기 설정 (최초 1회)
    Setup,
    /// 설정 관리 (~/.asurada/config.toml)
    Config {
        #[command(subcommand)]
        cmd: commands::config::ConfigCmd,
    },
}

fn main() -> Result<()> {
    let cli = Cli::parse();
    match cli.command {
        Commands::Mail { cmd } => commands::mail::run(cmd),
        Commands::Cal { cmd } => commands::cal::run(cmd),
        Commands::Spend { cmd } => commands::spend::run(cmd),
        Commands::Setup => commands::setup::run(),
        Commands::Config { cmd } => commands::config::run(cmd),
    }
}
