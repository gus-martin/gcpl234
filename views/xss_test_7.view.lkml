# The name of this view in Looker is "Xss Test 7"
view: xss_test_7 {
  # The sql_table_name parameter indicates the underlying database table
  # to be used for all fields in this view.
  sql_table_name: demo_db.xss_test_7 ;;
  # No primary key is defined for this view. In order to join this view in an Explore,
  # define primary_key: yes on a dimension that has no repeated values.

  # Here's what a typical dimension looks like in LookML.
  # A dimension is a groupable field that can be used to filter query results.
  # This dimension will be called "Script Srchttplol Comhello Jsscript" in Explore.

  dimension: script_srchttplol_comhello_jsscript {
    type: string
    sql: ${TABLE}.`<script src="http://lol.com/hello.js"></script>` ;;
  }

  measure: count {
    type: count
    drill_fields: []
  }
}
