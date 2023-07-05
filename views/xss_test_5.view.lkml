# The name of this view in Looker is "Xss Test 5"
view: xss_test_5 {
  # The sql_table_name parameter indicates the underlying database table
  # to be used for all fields in this view.
  sql_table_name: demo_db.xss_test_5 ;;
  # No primary key is defined for this view. In order to join this view in an Explore,
  # define primary_key: yes on a dimension that has no repeated values.

  # Here's what a typical dimension looks like in LookML.
  # A dimension is a groupable field that can be used to filter query results.
  # This dimension will be called "Svg Idx Onfocusalert1" in Explore.

  dimension: svg_idx_onfocusalert1 {
    type: string
    sql: ${TABLE}.`<svg id=x onfocus=alert(1)>` ;;
  }

  measure: count {
    type: count
    drill_fields: []
  }
}
