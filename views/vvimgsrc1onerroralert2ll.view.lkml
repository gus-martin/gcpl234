# The name of this view in Looker is "Vvimgsrc1onerroralert2ll"
view: vvimgsrc1onerroralert2ll {
  # The sql_table_name parameter indicates the underlying database table
  # to be used for all fields in this view.
  sql_table_name: demo_db.VV<img/src='1'onerror=alert(2)>LL ;;
  # No primary key is defined for this view. In order to join this view in an Explore,
  # define primary_key: yes on a dimension that has no repeated values.

  # Here's what a typical dimension looks like in LookML.
  # A dimension is a groupable field that can be used to filter query results.
  # This dimension will be called "Div Stylebackground" in Explore.

  dimension: div_stylebackground {
    type: string
    sql: ${TABLE}.`<div style="background->` ;;
  }

  measure: count {
    type: count
    drill_fields: []
  }
}
