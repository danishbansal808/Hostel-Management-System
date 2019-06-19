var r=true;

function validate()
{
    r=true;
    name();
    if(r==false)
        {return(r);}
    Email();
    if(r==false)
        {return(r);}
    phnno();
    return(r);
}

function name()
{
    var x=document.getElementById('name');
    if(x.value.length<=1)
    {
        alert("Please enter name");
        r=false;
    }
    else if(x.value.length>25)
    {
        alert("Enter max 25 letters");
        r=false;
    }
}

function Email()
{
    var email = document.getElementById('email');
    if (email.value.length<12)
    {
        alert('Please provide a valid email address');
        r=false;
    }
}

function phnno()
{
    var x=document.getElementById('number');
    if(isNaN(x.value))
    {
        alert("Please Enter no.");
        r=false;
    }
    if(x.value.length!=10)
    {
        alert("Please check no.");
        r=false;
    }
}



var blocklist = new Array(3)
blocklist["0"] = ["Floor"];
blocklist["A"] = ["G", "1", "2","3", "4", "5","6","7"];
blocklist["B"] = ["G", "1", "2", "3"];
blocklist["C"]= ["G", "1", "2", "3"];
function f1(Obj)
{
    var idx = Obj.selectedIndex;
    var which = Obj.options[idx].value;
    cList = blocklist[which];
    var cSelect = document.getElementById('floor');
    var len=cSelect.options.length;
    while (cSelect.options.length > 0)
    {
        cSelect.remove(0);
    }
    var newOption;
    for (var i=0; i<cList.length; i++)
    {
        newOption = document.createElement("option");
        newOption.value=i;
        newOption.text=cList[i];
        try
        {
            cSelect.add(newOption);
        }
        catch (e)
        {
            cSelect.appendChild(newOption);
        }
    }
}
