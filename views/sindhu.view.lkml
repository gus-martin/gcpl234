# The name of this view in Looker is "Sindhu"
view: sindhu {
  # The sql_table_name parameter indicates the underlying database table
  # to be used for all fields in this view.
  sql_table_name: demo_db.sindhu ;;
  # No primary key is defined for this view. In order to join this view in an Explore,
  # define primary_key: yes on a dimension that has no repeated values.

  # Here's what a typical dimension looks like in LookML.
  # A dimension is a groupable field that can be used to filter query results.
  # This dimension will be called "Balance" in Explore.

  dimension: balance {
    type: number
    sql: ${TABLE}.balance ;;
  }

  # A measure is a field that uses a SQL aggregate function. Here are defined sum and average
  # measures for this dimension, but you can also add measures of many different aggregates.
  # Click on the type parameter to see all the options in the Quick Help panel on the right.

  measure: total_balance {
    type: sum
    sql: ${balance} ;;
  }

  measure: average_balance {
    type: average
    sql: ${balance} ;;
  }

  dimension: balance_lag {
    type: number
    sql: ${TABLE}.balance_lag ;;
  }

  dimension: funding_amount {
    type: number
    sql: ${TABLE}.funding_amount ;;
  }

  # Dates and timestamps can be represented in Looker using a dimension group of type: time.
  # Looker converts dates and timestamps to the specified timeframes within the dimension group.

  dimension_group: funding {
    type: time
    timeframes: [
      raw,
      time,
      date,
      week,
      month,
      quarter,
      year
    ]
    sql: ${TABLE}.funding_time ;;
  }

  dimension: p_key {
    type: number
    sql: ${TABLE}.p_key ;;
  }

  dimension: purchase_key {
    type: number
    sql: ${TABLE}.purchase_key ;;
  }

  dimension: purchase_key_temp {
    type: number
    sql: ${TABLE}.purchase_key_temp ;;
  }

  dimension_group: purchase {
    type: time
    timeframes: [
      raw,
      time,
      date,
      week,
      month,
      quarter,
      year
    ]
    sql: ${TABLE}.purchase_time ;;
  }

  dimension: spotme_purchase_amount {
    type: number
    sql: ${TABLE}.spotme_purchase_amount ;;
  }

  dimension: user_id {
    type: number
    # hidden: yes
    sql: ${TABLE}.user_id ;;
  }

  measure: count {
    type: count
    drill_fields: [users.id, users.first_name, users.last_name]
  }
}
