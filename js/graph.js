var width = 830,
    height = 550,
    svg = (function(svg) {
        (function(cancha) {
            cancha.append("rect")
                .attr({
                    "width": "830",
                    "height": "550"
                });
            cancha.append("path")
                .attr("d", "M9.031,244.353H8.955v59.472h0.096l0.087,233.637h811.403V303.825l0,0v-59.472l0,0V10.723 H8.945L9.031,244.353z M129.131,418.536H12.766l-0.027-74.849h41.538V204.488H12.688l-0.028-74.841h116.471V418.536z M135.247,226.024c3.768,3.247,7.146,6.911,10.068,10.959c9.977,13.813,13.95,30.665,11.188,47.455 c-2.445,14.875-9.929,28.107-21.256,37.842V226.024z M12.73,297.735h-0.01l-0.017-47.292h0.338v-6.09h-0.341l-0.01-33.773h35.467 v127.019H12.735l-0.012-33.773h0.007V297.735z M818.674,250.443v47.292h1.867v-47.292H818.674z M816.87,210.58v33.773h-0.054 v6.09h0.054v47.292l0,0v6.09l0,0v33.773h-35.807V210.58H816.87z M816.87,129.647v74.841h-41.923v139.199h41.923v74.849H700.094 V129.647H816.87z M693.974,322.197c-24.659-21.308-29.408-58.312-9.982-85.214c2.903-4.019,6.249-7.654,9.982-10.882V322.197z M816.87,14.376v109.182H693.974v94.729c-5.732,4.269-10.765,9.348-14.948,15.141c-22.299,30.88-15.523,73.901,14.948,96.574 v94.622H816.87v109.183H417.317V345.829c38.422-1.604,69.188-33.197,69.188-71.82c0-38.625-30.767-70.219-69.188-71.822V14.376 H816.87z M417.317,208.279c35.049,1.597,63.067,30.462,63.067,65.729c0,35.266-28.019,64.134-63.067,65.729V208.279z M411.197,339.737c-35.044-1.595-63.063-30.463-63.063-65.729c0-35.267,28.019-64.133,63.063-65.729V339.737z M411.197,14.376 v187.81c-38.418,1.604-69.185,33.198-69.185,71.822c0,38.623,30.767,70.217,69.185,71.82v187.979H12.805l-0.037-109.183h122.479 v-94.556c14.654-10.859,24.337-26.66,27.294-44.646c0.628-3.816,0.939-7.632,0.939-11.424c0-14.486-4.53-28.577-13.192-40.571 c-4.208-5.826-9.269-10.927-15.041-15.206v-94.665H12.66L12.618,14.376H411.197z");
        })(
            svg.append("g")
            .attr("id", "cancha")
        )
        return svg;
    })(
        d3.select("#graph").append("svg")
        .attr({
            "width": width,
            "height": height,
            "xmlns": "http://www.w3.org/2000/svg"
        })
    ),
    linesGroup = svg.append("g")
        .attr("id", "lines"),
    playersGroup = svg.append("g")
        .attr("id", "players");

d3.csv("data/ccd.csv", function(error, coordenadas) {

    d3.json("data/ballpassed.json", function(error, links) {

        var totalByPair = function(a, b) {
                return links.filter(function(d) {
                    return (d.source.index == a && d.target.index == b);
                }).reduce(function(pv, av) {
                    return {
                        pair: [a, b],
                        count: pv.count + av.count
                    }
                });
            },
            totalByPlayer = function(a) {
                return links.filter(function(d) {
                    return (d.source.index == a);
                }).reduce(function(pv, av) {
                    return {
                        player: a,
                        count: pv.count + av.count
                    }
                });
            },
            ballPassed = function(thisNodeIndex, d) {
                return (thisNodeIndex == d.index) ? totalByPlayer(d.index).count :
                    totalByPair(thisNodeIndex, d.index).count;
            },
            lines = linesGroup
                .selectAll("line")
                .data(links)
                .enter()
                .append("line");

        (function(force) {
            force.on("tick", function() {
                lines
                    .attr({
                        "id": function(d) {
                            return d.source.posiciones + "-" + d.target.posiciones;
                        },
                        "x1": function(d) {
                            return d.source.x;
                        },
                        "y1": function(d) {
                            return d.source.y;
                        },
                        "x2": function(d) {
                            return d.target.x;
                        },
                        "y2": function(d) {
                            return d.target.y;
                        }
                    })
                    .style("stroke-width", function(d) {
                        return (totalByPair(d.source.index, d.target.index).count +
                            totalByPair(d.target.index, d.source.index).count) * .7;
                    });
                force.stop();
            });
            return force;
        })(
            d3.layout.force()
                .nodes(coordenadas)
                .links(links)
                .size([width, height])
                .start()
        );

        var player = (function(player) {
            player.append("defs")
                .append("clipPath")
                .attr("id", function(d) {
                    return "circleClipping_" + d.index;
                })
                .append("circle")
                .attr({
                    "cx": function(d) {
                        return d.x;
                    },
                    "cy": function(d) {
                        return d.y;
                    },
                    "r": "40px"
                });

            player.append("image")
                .attr({
                    "clip-path": function(d) {
                        return "url(#circleClipping_" + d.index + ")";
                    },
                    "xlink:href": function(d) {
                        return "images/" + d.nombre.toLowerCase() + ".jpg";
                    },
                    "x": function(d) {
                        return d.x - 40;
                    },
                    "y": function(d) {
                        return d.y - 40;
                    },
                    "height": "80px",
                    "width": "80px",
                    "filter": "url(#grayscale)"
                })
                .on("mouseover", function(d) {
                    linesGroup.selectAll("line")
                        .classed("color", true)
                        .style("stroke-width", function(d) {
                            return totalByPair(d.source.index, d.target.index).count * .7;
                        })
                        .filter(function(t) {
                            return (t.source.posiciones != d.posiciones);
                        })
                        .classed("hidden", true);

                    var thisNodeIndex = (function(thisNode) {
                        return thisNode.datum().index;
                    })(
                        d3.select(this)
                        .attr({
                            "filter": "url(#color)"
                        })
                    );

                    (function(box) {
                        box.append("rect")
                            .attr({
                                "width": 40,
                                "height": 17,
                                "x": function(d) {
                                    return d.x - 20;
                                },
                                "y": function(d) {
                                    return d.y - 45;
                                }
                            })
                            .classed("hidden", function(d) {
                                return !ballPassed(thisNodeIndex, d)
                            });

                        box.append("polygon")
                            .attr({
                                "transform": function(d) {
                                    return "translate(" + (parseFloat(d.x) - ((thisNodeIndex == d.index) ? 20 : 6)) + " " +
                                        (parseFloat(d.y) - ((thisNodeIndex == d.index) ? 45 : 28)) + ") " +
                                        "rotate (" + ((thisNodeIndex == d.index) ? 0 : 180) + ")";
                                },
                                "points": "9,6.4 6,3 3,6.4 3,9.3 5,7 5,13 7,13 7,7 9,9.3"
                            }).classed("hidden", function(d) {
                                var data = (thisNodeIndex == d.index) ? totalByPlayer(d.index).count : totalByPair(thisNodeIndex, d.index).count;
                                return !data;
                            });

                        box.append("text")
                            .attr({
                                "x": function(d) {
                                    return parseFloat(d.x) + 2;
                                },
                                "y": function(d) {
                                    return parseFloat(d.y) - 32;
                                }
                            })
                            .text(function(d) {
                                var data = (thisNodeIndex == d.index) ? totalByPlayer(d.index).count : totalByPair(thisNodeIndex, d.index).count;
                                return data;
                            }).classed("hidden", function(d) {
                                var data = (thisNodeIndex == d.index) ? totalByPlayer(d.index).count : totalByPair(thisNodeIndex, d.index).count;
                                return !data;
                            });
                    })(
                        player.append("g")
                            .attr("class", "box")
                            .classed("color", function(d) {
                                return thisNodeIndex == d.index;
                            })
                    );


                })
                .on("mouseout", function(d) {
                    d3.selectAll("line")
                        .classed({
                            "hidden": false,
                            "color": false
                        })
                        .style("stroke-width", function(d) {
                            return (totalByPair(d.source.index, d.target.index).count +
                                totalByPair(d.target.index, d.source.index).count) * .7;
                        });
                    player.selectAll("image")
                        .attr({
                            "filter": "url(#grayscale)"
                        });

                    d3.selectAll(".box")
                        .remove();
                });

            player.append("circle")
                .datum(function(d) {
                    d.fixed = true;
                    return d;
                })
                .attr({
                    "id": function(d) {
                        return d.posiciones;
                    },
                    "cx": function(d) {
                        return d.x;
                    },
                    "cy": function(d) {
                        return d.y;
                    },
                    "r": "40px"
                })
                .style({
                    "fill": "none",
                    "stroke": "black",
                    "stroke-width": "1px"
                });

            player.append("text")
                .attr({
                    "x": function(d) {
                        return parseFloat(d.x);
                    },
                    "y": function(d) {
                        return parseFloat(d.y) + 55;
                    }
                })
                .text(function(d) {
                    return d.nombre;
                });
            return player;
        })(
            playersGroup
                .selectAll("circle")
                .data(coordenadas)
                .enter()
                .append("g")
        );
    });
});