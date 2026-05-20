use anyhow::Result;
use chrono::Local;
use clap::Subcommand;
use console::style;

#[derive(Subcommand)]
pub enum SpendCmd {
    /// 소비 기록 추가
    Add {
        /// 금액 (KRW)
        #[arg(long, short)]
        amount: f64,
        /// 카테고리 (식비 | 교통 | 구독 | 쇼핑 | 의료 | 기타)
        #[arg(long, short)]
        category: String,
        /// 날짜 (YYYY-MM-DD, 기본값: 오늘)
        #[arg(long)]
        date: Option<String>,
        /// 메모
        #[arg(long)]
        note: Option<String>,
    },
    /// 소비 목록
    List {
        /// 월 필터 (YYYY-MM)
        #[arg(long)]
        month: Option<String>,
    },
    /// 월별 카테고리 리포트
    Report {
        /// 월 (YYYY-MM, 기본값: 이번 달)
        #[arg(long)]
        month: Option<String>,
    },
}

pub fn run(cmd: SpendCmd) -> Result<()> {
    let db_path = crate::paths::brain_db()?;
    let conn = crate::worker::brain::open(&db_path)?;
    let user_id = crate::paths::load_user_id()?;

    match cmd {
        SpendCmd::Add { amount, category, date, note } => {
            let date = date.unwrap_or_else(|| Local::now().format("%Y-%m-%d").to_string());
            let id = crate::worker::brain::spend_insert(
                &conn, &user_id, amount, &category, &date, note.as_deref(),
            )?;
            println!(
                "{} 소비 기록 — {} {}원 ({})",
                style("✓").green(),
                category,
                fmt_amount(amount),
                &id[..8]
            );
        }
        SpendCmd::List { month } => {
            let items = crate::worker::brain::spend_list(&conn, &user_id, month.as_deref())?;
            if items.is_empty() {
                println!("{} 소비 기록 없음", style("·").dim());
                return Ok(());
            }
            let total: f64 = items.iter().map(|i| i.amount).sum();
            println!("{}", style(format!("  {:<10}  {:<10}  {:<12}  {}", "날짜", "카테고리", "금액", "메모")).dim());
            for item in &items {
                println!(
                    "  {:<10}  {:<10}  {:>12}원  {}",
                    item.date,
                    item.category,
                    fmt_amount(item.amount),
                    item.note.as_deref().unwrap_or("")
                );
            }
            println!("{}", style(format!("  합계: {}원", fmt_amount(total))).bold());
        }
        SpendCmd::Report { month } => {
            let month = month.unwrap_or_else(|| Local::now().format("%Y-%m").to_string());
            let rows = crate::worker::brain::spend_report(&conn, &user_id, &month)?;
            if rows.is_empty() {
                println!("{} {} 소비 기록 없음", style("·").dim(), month);
                return Ok(());
            }
            let total: f64 = rows.iter().map(|(_, a)| a).sum();
            println!("{}", style(format!("── {} 소비 리포트 ──", month)).bold());
            for (cat, amount) in &rows {
                let pct = amount / total * 100.0;
                println!("  {:<10}  {:>12}원  ({:.0}%)", cat, fmt_amount(*amount), pct);
            }
            println!("{}", style(format!("  합계        {:>12}원", fmt_amount(total))).bold());
        }
    }
    Ok(())
}

fn fmt_amount(v: f64) -> String {
    let n = v as i64;
    let s = n.to_string();
    let mut out = String::new();
    for (i, c) in s.chars().rev().enumerate() {
        if i > 0 && i % 3 == 0 { out.push(','); }
        out.push(c);
    }
    out.chars().rev().collect()
}
