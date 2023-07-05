# The name of this view in Looker is "Xss Test 14"
view: xss_test_14 {
  # The sql_table_name parameter indicates the underlying database table
  # to be used for all fields in this view.
  sql_table_name: demo_db.xss_test_14 ;;
  # No primary key is defined for this view. In order to join this view in an Explore,
  # define primary_key: yes on a dimension that has no repeated values.

  # Here's what a typical dimension looks like in LookML.
  # A dimension is a groupable field that can be used to filter query results.
  # This dimension will be called "Backgroundimage Urldatatexthtmlimgonerroralert2" in Explore.

  dimension: backgroundimage_urldatatexthtmlimgonerroralert2 {
    type: string
    sql: ${TABLE}.`background-image: url(data:text/html,<img/onerror=alert(2)>)">`
      ;;
  }

  dimension: div_style {
    type: string
    sql: ${TABLE}.`<div style="` ;;
  }

  measure: count {
    type: count
    drill_fields: []
  }
}
