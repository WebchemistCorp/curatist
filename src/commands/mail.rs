use anyhow::Result;
use clap::Subcommand;
use console::style;

#[derive(Subcommand)]
pub enum MailCmd {
    /// 답장 필요한 메일 추가
    Add {
        /// 보낸 사람 이메일
        #[arg(long)]
        from: String,
        /// 제목
        #[arg(long, short)]
        subject: String,
        /// 보낸 사람 이름
        #[arg(long)]
        name: Option<String>,
        /// 우선순위 (high | normal)
        #[arg(long, default_value = "normal")]
        priority: String,
        /// 수신일 (YYYY-MM-DD)
        #[arg(long)]
        received: Option<String>,
        /// 메모
        #[arg(long)]
        notes: Option<String>,
    },
    /// 답장 대기 메일 목록
    List {
        /// 완료된 것 포함
        #[arg(long)]
        all: bool,
    },
    /// 답장 완료 처리
    Done {
        /// 메일 ID (list에서 확인)
        id: String,
    },
}

pub fn run(cmd: MailCmd) -> Result<()> {
    let db_path = crate::paths::brain_db()?;
    let conn = crate::worker::brain::open(&db_path)?;
    let user_id = crate::paths::load_user_id()?;

    match cmd {
        MailCmd::Add { from, subject, name, priority, received, notes } => {
            let id = crate::worker::brain::mail_insert(
                &conn, &user_id, &from, &subject,
                name.as_deref(), &priority,
                received.as_deref(), notes.as_deref(),
            )?;
            println!(
                "{} 메일 추가 — {} ({})",
                style("✓").green(),
                subject,
                &id[..8]
            );
        }
        MailCmd::List { all } => {
            let mails = crate::worker::brain::mail_list(&conn, &user_id, all)?;
            if mails.is_empty() {
                println!("{} 답장 대기 메일 없음", style("·").dim());
                return Ok(());
            }
            println!("{}", style(format!("  {:<8}  {:<6}  {:<22}  {}", "ID", "우선순위", "발신자", "제목")).dim());
            for m in &mails {
                let sender = match &m.from_name {
                    Some(n) => format!("{} <{}>", n, m.from_email),
                    None => m.from_email.clone(),
                };
                let priority_str = if m.priority == "high" {
                    style("high  ").red().to_string()
                } else {
                    style("normal").dim().to_string()
                };
                let status_icon = if m.status == "done" { style("✓").green() } else { style("·").yellow() };
                println!(
                    "  {}  {:<8}  {}  {:<22}  {}",
                    status_icon,
                    &m.id[..8],
                    priority_str,
                    sender.chars().take(22).collect::<String>(),
                    m.subject
                );
            }
        }
        MailCmd::Done { id } => {
            let ok = crate::worker::brain::mail_done(&conn, &id, &user_id)?;
            if ok {
                println!("{} 답장 완료 처리됨", style("✓").green());
            } else {
                println!("{} 해당 메일을 찾을 수 없습니다", style("!").yellow());
            }
        }
    }
    Ok(())
}
