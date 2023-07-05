# The name of this view in Looker is "Hundred Million Orders Wide"
view: hundred_million_orders_wide {
  # The sql_table_name parameter indicates the underlying database table
  # to be used for all fields in this view.
  sql_table_name: demo_db.hundred_million_orders_wide ;;
  # No primary key is defined for this view. In order to join this view in an Explore,
  # define primary_key: yes on a dimension that has no repeated values.

  # Here's what a typical dimension looks like in LookML.
  # A dimension is a groupable field that can be used to filter query results.
  # This dimension will be called "Customer ID" in Explore.

  dimension: customer_id {
    type: string
    sql: ${TABLE}.customer_id ;;
  }

  dimension: order_id {
    type: number
    # hidden: yes
    sql: ${TABLE}.order_id ;;
  }

  dimension: order_price {
    type: number
    sql: ${TABLE}.order_price ;;
  }

  # A measure is a field that uses a SQL aggregate function. Here are defined sum and average
  # measures for this dimension, but you can also add measures of many different aggregates.
  # Click on the type parameter to see all the options in the Quick Help panel on the right.

  measure: total_order_price {
    type: sum
    sql: ${order_price} ;;
  }

  measure: average_order_price {
    type: average
    sql: ${order_price} ;;
  }

  dimension: test1 {
    type: number
    sql: ${TABLE}.test1 ;;
  }

  dimension: test10 {
    type: number
    sql: ${TABLE}.test10 ;;
  }

  dimension: test11 {
    type: number
    sql: ${TABLE}.test11 ;;
  }

  dimension: test12 {
    type: number
    sql: ${TABLE}.test12 ;;
  }

  dimension: test13 {
    type: number
    sql: ${TABLE}.test13 ;;
  }

  dimension: test14 {
    type: number
    sql: ${TABLE}.test14 ;;
  }

  dimension: test15 {
    type: number
    sql: ${TABLE}.test15 ;;
  }

  dimension: test16 {
    type: number
    sql: ${TABLE}.test16 ;;
  }

  dimension: test17 {
    type: number
    sql: ${TABLE}.test17 ;;
  }

  dimension: test18 {
    type: number
    sql: ${TABLE}.test18 ;;
  }

  dimension: test19 {
    type: number
    sql: ${TABLE}.test19 ;;
  }

  dimension: test2 {
    type: number
    sql: ${TABLE}.test2 ;;
  }

  dimension: test20 {
    type: number
    sql: ${TABLE}.test20 ;;
  }

  dimension: test21 {
    type: number
    sql: ${TABLE}.test21 ;;
  }

  dimension: test22 {
    type: number
    sql: ${TABLE}.test22 ;;
  }

  dimension: test23 {
    type: number
    sql: ${TABLE}.test23 ;;
  }

  dimension: test24 {
    type: number
    sql: ${TABLE}.test24 ;;
  }

  dimension: test25 {
    type: number
    sql: ${TABLE}.test25 ;;
  }

  dimension: test26 {
    type: number
    sql: ${TABLE}.test26 ;;
  }

  dimension: test27 {
    type: number
    sql: ${TABLE}.test27 ;;
  }

  dimension: test28 {
    type: number
    sql: ${TABLE}.test28 ;;
  }

  dimension: test29 {
    type: number
    sql: ${TABLE}.test29 ;;
  }

  dimension: test3 {
    type: number
    sql: ${TABLE}.test3 ;;
  }

  dimension: test30 {
    type: number
    sql: ${TABLE}.test30 ;;
  }

  dimension: test31 {
    type: number
    sql: ${TABLE}.test31 ;;
  }

  dimension: test32 {
    type: number
    sql: ${TABLE}.test32 ;;
  }

  dimension: test33 {
    type: number
    sql: ${TABLE}.test33 ;;
  }

  dimension: test34 {
    type: number
    sql: ${TABLE}.test34 ;;
  }

  dimension: test35 {
    type: number
    sql: ${TABLE}.test35 ;;
  }

  dimension: test36 {
    type: number
    sql: ${TABLE}.test36 ;;
  }

  dimension: test37 {
    type: number
    sql: ${TABLE}.test37 ;;
  }

  dimension: test38 {
    type: number
    sql: ${TABLE}.test38 ;;
  }

  dimension: test39 {
    type: number
    sql: ${TABLE}.test39 ;;
  }

  dimension: test4 {
    type: number
    sql: ${TABLE}.test4 ;;
  }

  dimension: test40 {
    type: number
    sql: ${TABLE}.test40 ;;
  }

  dimension: test41 {
    type: number
    sql: ${TABLE}.test41 ;;
  }

  dimension: test42 {
    type: number
    sql: ${TABLE}.test42 ;;
  }

  dimension: test43 {
    type: number
    sql: ${TABLE}.test43 ;;
  }

  dimension: test44 {
    type: number
    sql: ${TABLE}.test44 ;;
  }

  dimension: test45 {
    type: number
    sql: ${TABLE}.test45 ;;
  }

  dimension: test46 {
    type: number
    sql: ${TABLE}.test46 ;;
  }

  dimension: test47 {
    type: number
    sql: ${TABLE}.test47 ;;
  }

  dimension: test48 {
    type: number
    sql: ${TABLE}.test48 ;;
  }

  dimension: test49 {
    type: number
    sql: ${TABLE}.test49 ;;
  }

  dimension: test5 {
    type: number
    sql: ${TABLE}.test5 ;;
  }

  dimension: test50 {
    type: number
    sql: ${TABLE}.test50 ;;
  }

  dimension: test6 {
    type: number
    sql: ${TABLE}.test6 ;;
  }

  dimension: test7 {
    type: number
    sql: ${TABLE}.test7 ;;
  }

  dimension: test8 {
    type: number
    sql: ${TABLE}.test8 ;;
  }

  dimension: test9 {
    type: number
    sql: ${TABLE}.test9 ;;
  }

  measure: count {
    type: count
    drill_fields: [orders.id]
  }
}
