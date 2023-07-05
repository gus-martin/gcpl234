# The name of this view in Looker is "Xss Test 13"
view: xss_test_13 {
  # The sql_table_name parameter indicates the underlying database table
  # to be used for all fields in this view.
  sql_table_name: demo_db.xss_test_13 ;;
  # No primary key is defined for this view. In order to join this view in an Explore,
  # define primary_key: yes on a dimension that has no repeated values.

  # Here's what a typical dimension looks like in LookML.
  # A dimension is a groupable field that can be used to filter query results.
  # This dimension will be called "Table Backgroundjavascriptprompt2" in Explore.

  dimension: table_backgroundjavascriptprompt2 {
    type: string
    sql: ${TABLE}.`<table background=javascript:prompt(2)>` ;;
  }

  measure: count {
    type: count
    drill_fields: []
  }
}
