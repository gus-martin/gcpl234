# The name of this view in Looker is "Test Space In Column Name"
view: test_space_in_column_name {
  # The sql_table_name parameter indicates the underlying database table
  # to be used for all fields in this view.
  sql_table_name: demo_db.test_space_in_column_name ;;
  # No primary key is defined for this view. In order to join this view in an Explore,
  # define primary_key: yes on a dimension that has no repeated values.

  # Here's what a typical dimension looks like in LookML.
  # A dimension is a groupable field that can be used to filter query results.
  # This dimension will be called "Test Test" in Explore.

  dimension: test_test {
    type: number
    sql: ${TABLE}.`test test` ;;
  }

  # A measure is a field that uses a SQL aggregate function. Here are defined sum and average
  # measures for this dimension, but you can also add measures of many different aggregates.
  # Click on the type parameter to see all the options in the Quick Help panel on the right.

  measure: total_test_test {
    type: sum
    sql: ${test_test} ;;
  }

  measure: average_test_test {
    type: average
    sql: ${test_test} ;;
  }

  measure: count {
    type: count
    drill_fields: []
  }
}
