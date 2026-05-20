use anyhow::Result;
use clap::Subcommand;
use console::style;

#[derive(Subcommand)]
pub enum CalCmd {
    /// 일정 추가
    Add {
        /// 제목
        #[arg(long, short)]
        title: String,
        /// 일시 (YYYY-MM-DD HH:MM 또는 YYYY-MM-DD)
        #[arg(long)]
        at: String,
        /// 유형 (meeting | deadline | personal | reminder)
        #[arg(long, default_value = "personal")]
        r#type: String,
        /// 장소
        #[arg(long)]
        location: Option<String>,
        /// 메모
        #[arg(long)]
        notes: Option<String>,
    },
    /// 일정 목록
    List {
        /// 지난 일정 포함
        #[arg(long)]
        all: bool,
    },
    /// 일정 완료/취소 처리
    Done {
        /// 일정 ID
        id: String,
    },
}

pub fn run(cmd: CalCmd) -> Result<()> {
    let db_path = crate::paths::brain_db()?;
    let conn = crate::worker::brain::open(&db_path)?;
    let user_id = crate::paths::load_user_id()?;

    match cmd {
        CalCmd::Add { title, at, r#type, location, notes } => {
            let id = crate::worker::brain::cal_insert(
                &conn, &user_id, &title, &r#type, &at,
                location.as_deref(), notes.as_deref(),
            )?;
            println!(
                "{} 일정 추가 — {} @ {} ({})",
                style("✓").green(),
                title, at,
                &id[..8]
            );
        }
        CalCmd::List { all } => {
            let schedules = crate::worker::brain::cal_list(&conn, &user_id, !all)?;
            if schedules.is_empty() {
                println!("{} 일정 없음", style("·").dim());
                return Ok(());
            }
            println!("{}", style(format!("  {:<8}  {:<16}  {:<10}  {}", "ID", "일시", "유형", "제목")).dim());
            for s in &schedules {
                let status_icon = if s.status == "done" { style("✓").green() } else { style("·").cyan() };
                println!(
                    "  {}  {:<8}  {:<16}  {:<10}  {}",
                    status_icon,
                    &s.id[..8],
                    &s.at.chars().take(16).collect::<String>(),
                    s.r#type,
                    s.title
                );
                if let Some(loc) = &s.location {
                    println!("              📍 {}", loc);
                }
            }
        }
        CalCmd::Done { id } => {
            let ok = crate::worker::brain::cal_done(&conn, &id, &user_id)?;
            if ok {
                println!("{} 일정 완료 처리됨", style("✓").green());
            } else {
                println!("{} 해당 일정을 찾을 수 없습니다", style("!").yellow());
            }
        }
    }
    Ok(())
}
