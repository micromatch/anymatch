exports.check = check = (criteria, string) ->

exports.checker = checker = (criteria) -> check.bind this, criteria

exports.sort = sort = (criteria, list) ->
