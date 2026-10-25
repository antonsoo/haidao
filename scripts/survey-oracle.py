"""An independent rational 2x2 line intersection, not an import of the TS solver."""
from fractions import Fraction as F
import json
import sys

def value(j):
    return F(int(j['n']), int(j['d']))

def intersection(h, s, a, b):
    # Each line is determined by two physical points, in Ax + By = C form.
    a1, b1, c1 = h, a, h*a
    a2, b2, c2 = h, b, h*(s+b)
    det = a1*b2-a2*b1
    if not det:
        return None
    return (c1*b2-c2*b1)/det, (a1*c2-a2*c1)/det

def main():
    count = 0
    comparisons = 0
    interval_samples = 0
    kinds = {}
    for line in sys.stdin:
        j = json.loads(line)
        st, result, bound = j['state'], j['solution'], j['bounds']
        h, s, a, b = [F(st[k], 4) for k in ('pole', 'gap', 'front', 'rear')]
        e = F(st['error'], 4)
        crossing = intersection(h,s,a,b)
        assert result['kind'] == ('parallel' if not crossing else 'forward' if crossing[0] < 0 else 'behind')
        assert value(result['delta']) == b-a
        for key in ('difference', 'gap'):
            c = result[key]
            if c is None:
                assert key == 'difference' and not crossing
                continue
            x = -value(c['distance'])
            H = value(c['height'])
            front = (h*a-h*x)/a
            rear = (h*(s+b)-h*x)/b
            assert value(c['front']) == front
            assert value(c['rear']) == rear
            assert value(c['frontResidual']) == H-front == 0
            assert value(c['rearResidual']) == H-rear
            if key == 'difference':
                assert (x,H) == crossing
            else:
                assert x == -a and H == 2*h
            comparisons += 1
        expected = 'invalid' if min(a,b)-e <= 0 else 'none' if b+e <= a-e else 'unbounded' if b-e <= a+e else 'bounded'
        assert bound['kind'] == expected
        kinds[expected] = kinds.get(expected,0)+1
        if expected in ('bounded','unbounded'):
            low = intersection(h,s,a-e,b+e)
            assert low
            assert -low[0] == value(bound['lowD']) and low[1] == value(bound['lowH'])
            if expected == 'bounded':
                high = intersection(h,s,a+e,b-e)
                assert high
                assert -high[0] == value(bound['highD']) and high[1] == value(bound['highH'])
            # Sample the interval square; cases outside forward geometry remain outside.
            for i in range(9):
                for k in range(9):
                    actual = intersection(h,s,a-e+2*e*F(i,8),b-e+2*e*F(k,8))
                    if actual and actual[0] < 0:
                        assert -actual[0] >= value(bound['lowD']) and actual[1] >= value(bound['lowH'])
                        if expected == 'bounded':
                            assert -actual[0] <= value(bound['highD']) and actual[1] <= value(bound['highH'])
                        interval_samples += 1
        count += 1
    assert count == 3005, f"Incomplete independent comparison: {count} records"
    print(json.dumps({'records':count,'candidate_comparisons':comparisons,'forward_interval_samples':interval_samples,'interval_kinds':kinds,'method':'Python Fraction; independent 2x2 determinant from two point-defined sight lines; 9x9 interval samples and exact endpoint checks'},indent=2))

if __name__ == '__main__':
    main()
