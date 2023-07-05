# The name of this view in Looker is "Xss Test 2"
view: xss_test_2 {
  # The sql_table_name parameter indicates the underlying database table
  # to be used for all fields in this view.
  sql_table_name: demo_db.xss_test_2 ;;
  # No primary key is defined for this view. In order to join this view in an Explore,
  # define primary_key: yes on a dimension that has no repeated values.

  # Here's what a typical dimension looks like in LookML.
  # A dimension is a groupable field that can be used to filter query results.
  # This dimension will be called "Imgsrc1onerroralert1" in Explore.

  dimension: imgsrc1onerroralert1 {
    type: string
    sql: ${TABLE}.`<img/src="1"onerror=alert(1)>` ;;
  }

  measure: count {
    type: count
    drill_fields: []
  }
}
