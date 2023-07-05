# The name of this view in Looker is "Xss Test 6"
view: xss_test_6 {
  # The sql_table_name parameter indicates the underlying database table
  # to be used for all fields in this view.
  sql_table_name: demo_db.xss_test_6 ;;
  # No primary key is defined for this view. In order to join this view in an Explore,
  # define primary_key: yes on a dimension that has no repeated values.

  # Here's what a typical dimension looks like in LookML.
  # A dimension is a groupable field that can be used to filter query results.
  # This dimension will be called "Svganimate Onbeginalert1 Attribute Namex Dur1s" in Explore.

  dimension: svganimate_onbeginalert1_attribute_namex_dur1s {
    type: string
    sql: ${TABLE}.`<svg><animate onbegin=alert(1) attributeName=x dur=1s>` ;;
  }

  measure: count {
    type: count
    drill_fields: []
  }
}
